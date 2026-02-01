// Visual QA Agent - Background Service Worker
console.log('🚀 [Background] Visual QA Agent loaded');

// Open sidebar when extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
    await chrome.sidePanel.open({ windowId: tab.windowId });
    console.log('✅ [Background] Sidebar opened');
});

// Message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📨 [Background] Received message:', request.type);

    if (request.type === 'RUN_BUG_DETECTION') {
        handleBugDetection(request.tests, sendResponse);
        return true; // Keep channel open for async response
    }

    if (request.type === 'START_AGENT') {
        handleStartAgent(request.goal, sendResponse);
        return true;
    }
});

async function handleBugDetection(tests: any[], sendResponse: (response: any) => void) {
    console.log('🐛 [Background] Starting bug detection for tests:', tests);

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.id) {
            throw new Error('No active tab found');
        }

        console.log('✅ [Background] Found active tab:', tab.id, tab.url);

        // Check if content script is ready
        let contentScriptReady = false;
        try {
            await chrome.tabs.sendMessage(tab.id, { type: 'PING' });
            contentScriptReady = true;
            console.log('✅ [Background] Content script ready');
        } catch (pingError) {
            console.log('⚠️ [Background] Content script not loaded, will inject');
        }

        // If content script not ready, inject it
        if (!contentScriptReady) {
            console.log('💉 [Background] Injecting content script into tab:', tab.id);

            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['content.js']
                });

                // Wait for content script to initialize
                await new Promise(resolve => setTimeout(resolve, 500));
                console.log('✅ [Background] Content script injected successfully');
            } catch (injectError: any) {
                console.error('❌ [Background] Failed to inject content script:', injectError);
                throw new Error(`Cannot run tests on this page. Try refreshing the page first. (${injectError.message})`);
            }
        }

        // Now send the test request
        console.log('📤 [Background] Sending message to content script on tab:', tab.id);
        const response = await chrome.tabs.sendMessage(tab.id, {
            type: 'RUN_BUG_DETECTION',
            tests: tests
        });

        console.log('📥 [Background] Received response from content script:', response);
        sendResponse(response);

    } catch (error: any) {
        console.error('❌ [Background] Bug detection error:', error);
        sendResponse({ success: false, error: error.message || String(error) });
    }
}

async function handleStartAgent(goal: string, sendResponse: (response: any) => void) {
    console.log('🎯 [Background] Starting agent with goal:', goal);
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab.id) throw new Error('No active tab found');

        // Capture screenshot
        const screenshotUrl = await chrome.tabs.captureVisibleTab(
            tab.windowId || chrome.windows.WINDOW_ID_CURRENT,
            { format: 'jpeg' }
        );

        // Get page HTML
        const [{ result: html }] = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => document.documentElement.outerHTML
        });

        sendResponse({ success: true, screenshot: screenshotUrl, html });

    } catch (error: any) {
        console.error('❌ [Background] Agent Error:', error);
        sendResponse({ success: false, error: error.message || String(error) });
    }
}
