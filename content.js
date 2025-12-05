// Content script for Chzzk Chat Exporter
// This script fetches chat data from Chzzk API

let isCollecting = false;
let chatData = [];
let videoInfo = null;
let fetchInterval = null;
let videoNo = null;
let channelId = null;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startCollecting') {
        startCollecting().then(success => {
            sendResponse({ success: success });
        });
        return true; // Keep channel open for async response
    } else if (request.action === 'stopCollecting') {
        stopCollecting();
        sendResponse({ success: true, chatData: chatData });
    } else if (request.action === 'getStatus') {
        sendResponse({
            isCollecting: isCollecting,
            chatData: chatData,
            videoInfo: videoInfo
        });
    }
    return true;
});

// Extract video/channel ID from URL
function extractIds() {
    const url = window.location.href;

    // Extract video number from VOD URL: /video/12345
    const videoMatch = url.match(/\/video\/(\d+)/);
    if (videoMatch) {
        videoNo = videoMatch[1];
        console.log('VOD detected, videoNo:', videoNo);
        return { type: 'vod', id: videoNo };
    }

    // Extract channel ID from live URL: /live/channelId
    const liveMatch = url.match(/\/live\/([^/?]+)/);
    if (liveMatch) {
        channelId = liveMatch[1];
        console.log('Live stream detected, channelId:', channelId);
        return { type: 'live', id: channelId };
    }

    return null;
}

// Start collecting chat messages
async function startCollecting() {
    if (isCollecting) return true;

    const ids = extractIds();
    if (!ids) {
        console.error('Could not extract video/channel ID from URL');
        return false;
    }

    isCollecting = true;
    chatData = [];

    // Get video information
    await extractVideoInfo();

    // Fetch chat data based on type
    if (ids.type === 'vod') {
        await fetchVODChat(ids.id);
    } else if (ids.type === 'live') {
        await fetchLiveChat(ids.id);
    }

    // Save state
    saveState();

    console.log('Chzzk Chat Exporter: Started collecting');
    return true;
}

// Stop collecting chat messages
function stopCollecting() {
    if (!isCollecting) return;

    isCollecting = false;

    // Stop interval if running
    if (fetchInterval) {
        clearInterval(fetchInterval);
        fetchInterval = null;
    }

    // Save final data
    saveState();

    console.log('Chzzk Chat Exporter: Stopped collecting. Total messages:', chatData.length);
}

// Extract video information from API
async function extractVideoInfo() {
    try {
        // Fetch video metadata from Chzzk API
        if (videoNo) {
            const apiUrl = `https://api.chzzk.naver.com/service/v2/videos/${videoNo}`;
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json();
                const content = data?.content || {};

                // Extract title
                const title = content?.videoTitle ||
                    content?.title ||
                    document.title;

                // Extract channel name
                const channelName = content?.channel?.channelName ||
                    content?.channelName ||
                    '채널미상';

                videoInfo = {
                    title: title,
                    channelName: channelName,
                    url: window.location.href,
                    videoNo: videoNo,
                    channelId: channelId
                };

                console.log('Video info fetched from API:', videoInfo);
            } else {
                // Fallback to DOM parsing if API fails
                await extractVideoInfoFromDOM();
            }
        } else {
            // For live streams, use DOM parsing
            await extractVideoInfoFromDOM();
        }

        // Save video info
        await chrome.storage.local.set({ videoInfo: videoInfo });

    } catch (error) {
        console.error('Error extracting video info from API:', error);
        // Fallback to DOM parsing
        await extractVideoInfoFromDOM();
    }
}

// Fallback: Extract video information from DOM
async function extractVideoInfoFromDOM() {
    try {
        // Try to get video title from meta tags or page elements
        const titleElement = document.querySelector('meta[property="og:title"]') ||
            document.querySelector('h2[class*="live_information_title"]') ||
            document.querySelector('[class*="LiveTitle"]');

        const title = titleElement ?
            (titleElement.content || titleElement.textContent || '').trim() :
            document.title;

        // Try to get channel name
        const channelElement = document.querySelector('meta[property="og:site_name"]') ||
            document.querySelector('[class*="live_information_channel"]') ||
            document.querySelector('[class*="ChannelName"]');

        const channelName = channelElement ?
            (channelElement.content || channelElement.textContent || '').trim() :
            '';

        videoInfo = {
            title: title,
            channelName: channelName,
            url: window.location.href,
            videoNo: videoNo,
            channelId: channelId
        };

        console.log('Video info extracted from DOM:', videoInfo);
    } catch (error) {
        console.error('Error extracting video info from DOM:', error);
    }
}

// Fetch VOD chat data from API
async function fetchVODChat(videoNo) {
    console.log('Fetching VOD chat for video:', videoNo);

    try {
        // Chzzk VOD chat API endpoint (correct endpoint from reference code)
        const baseUrl = `https://api.chzzk.naver.com/service/v1/videos/${videoNo}/chats`;

        let playerMessageTime = 0;
        let pageCount = 0;
        const maxPages = 10000; // Safety limit
        const maxEmptyRetry = 3;
        let emptyRetry = 0;

        while (isCollecting && pageCount < maxPages) {
            const apiUrl = `${baseUrl}?playerMessageTime=${playerMessageTime}`;

            console.log(`Fetching page ${pageCount + 1}, time: ${playerMessageTime}...`);

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                console.error('API request failed:', response.status);
                if (response.status === 404 || response.status === 500) {
                    break; // End of data
                }
                // Retry with delay
                await new Promise(resolve => setTimeout(resolve, 500));
                continue;
            }

            const data = await response.json();
            const chats = data?.content?.videoChats || [];

            if (chats.length === 0) {
                emptyRetry++;
                console.log(`Empty response, retry ${emptyRetry}/${maxEmptyRetry}`);
                if (emptyRetry >= maxEmptyRetry) {
                    console.log('No more chats available');
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 500));
                continue;
            }

            emptyRetry = 0; // Reset empty retry counter

            // Process chats
            let pageMaxTime = playerMessageTime;
            chats.forEach(chat => {
                const pm = chat.playerMessageTime || 0;
                pageMaxTime = Math.max(pageMaxTime, pm);

                // Extract nickname from profile JSON
                let nickname = 'Unknown';
                try {
                    if (chat.profile) {
                        const profileObj = JSON.parse(chat.profile);
                        nickname = profileObj?.nickname || nickname;
                    }
                } catch (e) {
                    console.error('Error parsing profile:', e);
                }

                if (chat.userIdHash === 'SYSTEM_MESSAGE') {
                    nickname = '[SYSTEM]';
                }

                // Get message content
                let message = chat.content || '';
                if (chat.messageStatusType === 'CBOTBLIND') {
                    message = '클린봇이 부적절한 표현을 감지했습니다';
                }

                // Convert playerMessageTime (ms) to timestamp
                const timestamp = new Date(pm).toISOString();

                const chatMessage = {
                    timestamp: timestamp,
                    userId: nickname,
                    message: message
                };

                chatData.push(chatMessage);
            });

            console.log(`Collected ${chats.length} messages (total: ${chatData.length})`);

            // Update storage periodically
            if (pageCount % 10 === 0) {
                saveState();
            }

            // Get last message time for next request
            const lastChat = chats[chats.length - 1];
            const lastTime = lastChat?.playerMessageTime;

            if (typeof lastTime !== 'number') {
                console.log('Invalid last time, stopping');
                break;
            }

            // Move to next time position
            playerMessageTime = lastTime + 1;
            pageCount++;

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 150));
        }

        console.log(`VOD chat collection complete. Total messages: ${chatData.length}`);

        // Auto-download CSV when collection completes
        if (chatData.length > 0) {
            console.log('Auto-downloading CSV...');
            await autoDownloadCSV();
        }

    } catch (error) {
        console.error('Error fetching VOD chat:', error);
    }
}

// Auto-download CSV after collection completes
async function autoDownloadCSV() {
    try {
        // Generate filename
        const timestamp = new Date().toISOString().split('T')[0];
        const channelNameSafe = (videoInfo?.channelName || 'chzzk').replace(/[^a-zA-Z0-9가-힣]/g, '_');
        const videoNoSafe = videoInfo?.videoNo || videoNo || 'unknown';
        const baseFilename = `[${timestamp}]_${channelNameSafe}_${videoNoSafe}`;

        // Check file size and split if necessary
        const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20MB limit
        const header = 'Timestamp,User ID,Message\n';
        const bom = '\uFEFF';

        // Calculate total size
        let totalContent = bom + header;
        for (const chat of chatData) {
            const timestamp = chat.timestamp || '';
            const userId = escapeCSVField(chat.userId || '');
            const message = escapeCSVField(chat.message || '');
            totalContent += `${timestamp},${userId},${message}\n`;
        }

        const totalSize = new TextEncoder().encode(totalContent).length;
        console.log(`CSV size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

        if (totalSize <= MAX_SIZE_BYTES) {
            // Single file download
            const blob = new Blob([totalContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const filename = `${baseFilename}.csv`;

            await chrome.downloads.download({
                url: url,
                filename: filename,
                saveAs: false
            });

            console.log(`CSV downloaded: ${filename} (${chatData.length} messages)`);
        } else {
            // Split into multiple files
            console.log('File too large, splitting into parts...');
            await downloadCSVInParts(chatData, baseFilename, MAX_SIZE_BYTES);
        }
    } catch (error) {
        console.error('Error auto-downloading CSV:', error);
    }
}

// Download CSV in multiple parts
async function downloadCSVInParts(data, baseFilename, maxSize) {
    const header = 'Timestamp,User ID,Message\n';
    const bom = '\uFEFF';

    let part = 1;
    let chunk = bom + header;
    let chunkSize = new TextEncoder().encode(chunk).length;
    let startIndex = 0;

    for (let i = 0; i < data.length; i++) {
        const chat = data[i];
        const timestamp = chat.timestamp || '';
        const userId = escapeCSVField(chat.userId || '');
        const message = escapeCSVField(chat.message || '');
        const line = `${timestamp},${userId},${message}\n`;
        const lineSize = new TextEncoder().encode(line).length;

        // Check if adding this line would exceed the limit
        if (chunkSize + lineSize > maxSize && i > startIndex) {
            // Save current chunk
            const blob = new Blob([chunk], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const filename = `${baseFilename}_part${String(part).padStart(3, '0')}.csv`;

            await chrome.downloads.download({
                url: url,
                filename: filename,
                saveAs: false
            });

            console.log(`Downloaded part ${part}: ${i - startIndex} messages`);

            // Start new chunk
            part++;
            chunk = bom + header;
            chunkSize = new TextEncoder().encode(chunk).length;
            startIndex = i;
        }

        chunk += line;
        chunkSize += lineSize;
    }

    // Save final chunk
    if (chunkSize > new TextEncoder().encode(bom + header).length) {
        const blob = new Blob([chunk], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const filename = `${baseFilename}_part${String(part).padStart(3, '0')}.csv`;

        await chrome.downloads.download({
            url: url,
            filename: filename,
            saveAs: false
        });

        console.log(`Downloaded part ${part}: ${data.length - startIndex} messages`);
    }

    console.log(`Total parts downloaded: ${part}`);
}

// Escape CSV field
function escapeCSVField(str) {
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

// Fetch live chat data
async function fetchLiveChat(channelId) {
    console.log('Fetching live chat for channel:', channelId);

    // For live streams, we need to use WebSocket or polling
    // This is a simplified version that polls the recent chat API

    fetchInterval = setInterval(async () => {
        if (!isCollecting) {
            clearInterval(fetchInterval);
            return;
        }

        try {
            // This endpoint might need authentication
            const apiUrl = `https://api.chzzk.naver.com/polling/v1/channels/${channelId}/live-detail`;

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                console.error('Live chat API request failed:', response.status);
                return;
            }

            const data = await response.json();

            // Process chat data from response
            // Note: The actual structure may vary, this is a placeholder
            if (data.content && data.content.chatMessages) {
                data.content.chatMessages.forEach(msg => {
                    const chatMessage = {
                        timestamp: new Date(msg.createTime || Date.now()).toISOString(),
                        userId: msg.userNickname || msg.userId || 'Unknown',
                        message: msg.content || ''
                    };

                    // Check for duplicates
                    const isDuplicate = chatData.some(chat =>
                        chat.timestamp === chatMessage.timestamp &&
                        chat.userId === chatMessage.userId &&
                        chat.message === chatMessage.message
                    );

                    if (!isDuplicate) {
                        chatData.push(chatMessage);
                    }
                });

                saveState();
            }

        } catch (error) {
            console.error('Error fetching live chat:', error);
        }
    }, 2000); // Poll every 2 seconds
}

// Save current state to storage
function saveState() {
    chrome.storage.local.set({
        chatData: chatData,
        isCollecting: isCollecting,
        videoInfo: videoInfo
    });
}

// Load saved state on page load
async function loadState() {
    try {
        const result = await chrome.storage.local.get(['chatData', 'isCollecting', 'videoInfo']);

        if (result.chatData) {
            chatData = result.chatData;
        }

        if (result.videoInfo) {
            videoInfo = result.videoInfo;
        }

        // Don't auto-resume collecting on page load
        // User should manually start
    } catch (error) {
        console.error('Error loading state:', error);
    }
}

// Initialize
console.log('Chzzk Chat Exporter: Content script loaded');
loadState();
