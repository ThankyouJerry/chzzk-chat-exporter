// Popup script for Chzzk Chat Exporter
// Works from any page - just input the URL

// DOM elements
const videoUrlInput = document.getElementById('videoUrl');
const timeStartInput = document.getElementById('timeStart');
const timeEndInput = document.getElementById('timeEnd');
const startBtn = document.getElementById('startBtn');
const progressSection = document.getElementById('progressSection');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const statusDiv = document.getElementById('status');
const statusText = document.getElementById('statusText');
const videoInfo = document.getElementById('videoInfo');
const videoTitle = document.getElementById('videoTitle');
const channelName = document.getElementById('channelName');
const chatCount = document.getElementById('chatCount');

let isCollecting = false;

// Initialize
async function init() {
    // Load saved URL
    const { lastUrl } = await chrome.storage.local.get('lastUrl');
    if (lastUrl) {
        videoUrlInput.value = lastUrl;
    }

    updateStatus('info', '치지직 VOD 링크를 입력하세요');
}

// Update status
function updateStatus(type, message) {
    statusDiv.className = 'status-info ' + type;
    statusText.textContent = message;
}

// Parse time string (HH:MM:SS) to milliseconds
function parseTimeToMs(timeStr) {
    if (!timeStr || !timeStr.trim()) return null;

    const parts = timeStr.trim().split(':').map(Number);
    if (parts.some(n => isNaN(n))) return null;

    let h = 0, m = 0, s = 0;
    if (parts.length === 3) [h, m, s] = parts;
    else if (parts.length === 2) [m, s] = parts;
    else[s] = parts;

    return ((h * 3600) + (m * 60) + s) * 1000;
}

// Extract video ID from URL or input
function extractVideoId(input) {
    if (!input) return null;

    input = input.trim();

    // Direct number input
    if (/^\d+$/.test(input)) {
        return input;
    }

    // URL format: https://chzzk.naver.com/video/12345
    const match = input.match(/\/video\/(\d+)/);
    if (match) {
        return match[1];
    }

    return null;
}

// Start collection
startBtn.addEventListener('click', async () => {
    const input = videoUrlInput.value.trim();

    if (!input) {
        updateStatus('error', '⚠️ VOD 링크를 입력하세요');
        return;
    }

    const videoId = extractVideoId(input);
    if (!videoId) {
        updateStatus('error', '⚠️ 올바른 치지직 VOD 링크를 입력하세요');
        return;
    }

    // Parse time range
    const timeStart = parseTimeToMs(timeStartInput.value) || 0;
    const timeEnd = parseTimeToMs(timeEndInput.value);

    // Save URL for next time
    await chrome.storage.local.set({ lastUrl: input });

    // Start collection in background
    isCollecting = true;
    startBtn.disabled = true;
    progressSection.classList.add('active');
    updateStatus('warning', '🔄 채팅 수집 중...');

    try {
        // Send message to background script
        const response = await chrome.runtime.sendMessage({
            action: 'startCollection',
            videoId: videoId,
            timeStart: timeStart,
            timeEnd: timeEnd
        });

        if (response && response.success) {
            // Start polling for progress
            startPolling();
        } else {
            updateStatus('error', '⚠️ 수집 시작 실패');
            startBtn.disabled = false;
            isCollecting = false;
        }
    } catch (error) {
        console.error('Error starting collection:', error);
        updateStatus('error', '⚠️ 오류가 발생했습니다');
        startBtn.disabled = false;
        isCollecting = false;
    }
});

// Poll for progress updates
let pollingInterval = null;

function startPolling() {
    pollingInterval = setInterval(async () => {
        try {
            const result = await chrome.storage.local.get(['collectionProgress', 'videoInfo', 'chatData']);

            if (result.collectionProgress) {
                const { percent, status, isComplete } = result.collectionProgress;

                // Update progress bar
                progressFill.style.width = `${percent}%`;
                progressText.textContent = `${percent}%`;

                // Update status
                if (status) {
                    updateStatus('warning', status);
                }

                // Update video info
                if (result.videoInfo) {
                    videoInfo.style.display = 'block';
                    videoTitle.textContent = result.videoInfo.title || '-';
                    channelName.textContent = result.videoInfo.channelName || '-';
                }

                // Update chat count
                if (result.chatData) {
                    chatCount.textContent = result.chatData.length.toLocaleString();
                }

                // Check if complete
                if (isComplete) {
                    stopPolling();
                    isCollecting = false;
                    startBtn.disabled = false;
                    updateStatus('success', '✅ 수집 완료 및 CSV 자동 다운로드됨');
                }
            }
        } catch (error) {
            console.error('Polling error:', error);
        }
    }, 500);
}

function stopPolling() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
    }
}

// Cleanup on close
window.addEventListener('unload', () => {
    stopPolling();
});

// Initialize
init();
