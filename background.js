let collectionInProgress = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startCollection') {
        if (collectionInProgress) {
            sendResponse({ success: false, error: '이미 채팅을 수집하고 있습니다.' });
            return false;
        }

        collectionInProgress = true;
        startCollection(request.videoId, request.timeStart, request.timeEnd)
            .finally(() => {
                collectionInProgress = false;
            });
        sendResponse({ success: true });
    }
    return false;
});

async function startCollection(videoId, timeStart, timeEnd) {
    try {
        await chrome.storage.local.remove('chatData');
        await chrome.storage.local.set({
            collectionProgress: {
                percent: 0,
                status: '채팅 수집 시작...',
                chatCount: 0,
                isComplete: false
            }
        });

        // Fetch video metadata
        const metadataUrl = `https://api.chzzk.naver.com/service/v2/videos/${videoId}`;
        const metadataResponse = await fetch(metadataUrl);
        if (!metadataResponse.ok) {
            throw new Error(`영상 정보를 가져오지 못했습니다. (${metadataResponse.status})`);
        }
        const metadataData = await metadataResponse.json();
        const content = metadataData?.content || {};

        const videoInfo = {
            title: content?.videoTitle || content?.title || '제목 없음',
            channelName: content?.channel?.channelName || content?.channelName || '채널 미상',
            videoNo: videoId
        };

        await chrome.storage.local.set({ videoInfo });

        // Fetch chat data
        await fetchChatData(videoId, timeStart, timeEnd, videoInfo);

    } catch (error) {
        console.error('Collection error:', error);
        await chrome.storage.local.set({
            collectionProgress: {
                percent: 0,
                status: '⚠️ 오류 발생: ' + error.message,
                chatCount: 0,
                isComplete: true
            }
        });
    }
}

async function fetchChatData(videoId, timeStart, timeEnd, videoInfo) {
    const chatData = [];
    const baseUrl = `https://api.chzzk.naver.com/service/v1/videos/${videoId}/chats`;

    let playerMessageTime = timeStart || 0;
    let pageCount = 0;
    const maxPages = 10000;
    const maxEmptyRetry = 3;
    const maxRequestRetry = 5;
    let emptyRetry = 0;
    let requestRetry = 0;
    let reachedEnd = false;

    const hasEnd = timeEnd !== null && timeEnd !== undefined;

    while (pageCount < maxPages && !reachedEnd) {
        const apiUrl = `${baseUrl}?playerMessageTime=${playerMessageTime}`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                if (response.status === 404 || response.status === 500) {
                    break;
                }
                requestRetry++;
                if (requestRetry >= maxRequestRetry) {
                    throw new Error(`채팅 API 요청이 반복해서 실패했습니다. (${response.status})`);
                }
                await sleep(500);
                continue;
            }
            requestRetry = 0;

            const data = await response.json();
            const chats = data?.content?.videoChats || [];

            if (chats.length === 0) {
                emptyRetry++;
                if (emptyRetry >= maxEmptyRetry) {
                    break;
                }
                await sleep(500);
                continue;
            }

            emptyRetry = 0;

            // Process chats
            for (const chat of chats) {
                const pm = chat.playerMessageTime || 0;

                // Skip if before start time
                if (pm < timeStart) continue;

                // Stop if after end time
                if (hasEnd && pm > timeEnd) {
                    reachedEnd = true;
                    break;
                }

                // Extract nickname
                let nickname = 'Unknown';
                try {
                    if (chat.profile) {
                        const profileObj = JSON.parse(chat.profile);
                        nickname = profileObj?.nickname || nickname;
                    }
                } catch (e) { }

                if (chat.userIdHash === 'SYSTEM_MESSAGE') {
                    nickname = '[SYSTEM]';
                }

                // Get message
                let message = chat.content || '';
                if (chat.messageStatusType === 'CBOTBLIND') {
                    message = '클린봇이 부적절한 표현을 감지했습니다';
                }

                chatData.push({
                    timestamp: formatElapsedTime(pm),
                    userId: nickname,
                    message: message
                });
            }

            // Update progress
            const lastChat = chats[chats.length - 1];
            const lastTime = lastChat?.playerMessageTime;

            if (typeof lastTime !== 'number') break;

            playerMessageTime = lastTime + 1;
            pageCount++;

            // Calculate progress (rough estimate)
            let percent = 0;
            if (hasEnd) {
                const range = timeEnd - timeStart;
                const current = lastTime - timeStart;
                percent = Math.max(0, Math.min(100, Math.floor((current / range) * 100)));
            } else {
                // Just show that we're making progress
                percent = Math.min(95, pageCount);
            }

            await chrome.storage.local.set({
                collectionProgress: {
                    percent: percent,
                    status: `수집 중... (${chatData.length.toLocaleString()}개)`,
                    chatCount: chatData.length,
                    isComplete: false
                }
            });

            await sleep(150);

        } catch (error) {
            console.error('Fetch error:', error);
            requestRetry++;
            if (requestRetry >= maxRequestRetry) {
                throw error;
            }
            await sleep(500);
        }
    }

    // Collection complete - auto download
    await chrome.storage.local.set({
        collectionProgress: {
            percent: 100,
            status: 'CSV 생성 중...',
            chatCount: chatData.length,
            isComplete: false
        }
    });

    if (chatData.length > 0) {
        await autoDownloadCSV(chatData, videoInfo);
    }

    // Mark as complete
    await chrome.storage.local.set({
        collectionProgress: {
            percent: 100,
            status: `✅ 완료! (${chatData.length.toLocaleString()}개 메시지)`,
            chatCount: chatData.length,
            isComplete: true
        }
    });
}

async function autoDownloadCSV(chatData, videoInfo) {
    const timestamp = new Date().toISOString().split('T')[0];
    const channelNameSafe = (videoInfo?.channelName || 'chzzk').replace(/[^a-zA-Z0-9가-힣]/g, '_');
    const videoNoSafe = videoInfo?.videoNo || 'unknown';
    const baseFilename = `[${timestamp}]_${channelNameSafe}_${videoNoSafe}`;

    const MAX_SIZE_BYTES = 20 * 1024 * 1024;
    const header = 'Timestamp,User ID,Message\n';
    const bom = '\uFEFF';

    // Calculate total size
    let totalContent = bom + header;
    for (const chat of chatData) {
        const timestamp = chat.timestamp || '';
        const userId = escapeCSV(chat.userId || '');
        const message = escapeCSV(chat.message || '');
        totalContent += `${timestamp},${userId},${message}\n`;
    }

    const totalSize = new TextEncoder().encode(totalContent).length;

    if (totalSize <= MAX_SIZE_BYTES) {
        // Single file
        const blob = new Blob([totalContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        await chrome.downloads.download({
            url: url,
            filename: `${baseFilename}.csv`,
            saveAs: false
        });
    } else {
        // Split into parts
        await downloadInParts(chatData, baseFilename, MAX_SIZE_BYTES);
    }
}

async function downloadInParts(chatData, baseFilename, maxSize) {
    const header = 'Timestamp,User ID,Message\n';
    const bom = '\uFEFF';

    let part = 1;
    let chunk = bom + header;
    let chunkSize = new TextEncoder().encode(chunk).length;
    let startIndex = 0;

    for (let i = 0; i < chatData.length; i++) {
        const chat = chatData[i];
        const timestamp = chat.timestamp || '';
        const userId = escapeCSV(chat.userId || '');
        const message = escapeCSV(chat.message || '');
        const line = `${timestamp},${userId},${message}\n`;
        const lineSize = new TextEncoder().encode(line).length;

        if (chunkSize + lineSize > maxSize && i > startIndex) {
            const blob = new Blob([chunk], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);

            await chrome.downloads.download({
                url: url,
                filename: `${baseFilename}_part${String(part).padStart(3, '0')}.csv`,
                saveAs: false
            });

            part++;
            chunk = bom + header;
            chunkSize = new TextEncoder().encode(chunk).length;
            startIndex = i;
        }

        chunk += line;
        chunkSize += lineSize;
    }

    // Final chunk
    if (chunkSize > new TextEncoder().encode(bom + header).length) {
        const blob = new Blob([chunk], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        await chrome.downloads.download({
            url: url,
            filename: `${baseFilename}_part${String(part).padStart(3, '0')}.csv`,
            saveAs: false
        });
    }
}

function escapeCSV(str) {
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function formatElapsedTime(milliseconds) {
    const total = Math.max(0, Number(milliseconds) || 0);
    const hours = Math.floor(total / 3600000);
    const minutes = Math.floor((total % 3600000) / 60000);
    const seconds = Math.floor((total % 60000) / 1000);
    const millis = Math.floor(total % 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
