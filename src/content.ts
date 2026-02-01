import { BugDetectionService } from './services/bugDetectionService';

console.log('📝 [Content] Visual QA Agent content script loaded');

// Message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📨 [Content] Received message:', request.type);

    // PING handler for connection detection
    if (request.type === 'PING') {
        console.log('🏓 [Content] PING received, responding with PONG');
        sendResponse({ success: true, message: 'PONG' });
        return true;
    }

    // Get DOM handler
    if (request.type === 'GET_DOM') {
        const html = document.documentElement.outerHTML;
        sendResponse({ success: true, html });
        return true;
    }

    // Bug detection handler
    if (request.type === 'RUN_BUG_DETECTION') {
        console.log('📥 [Content] Received RUN_BUG_DETECTION request');

        (async () => {
            try {
                const service = new BugDetectionService(document);
                const report = await service.runTests(request.tests);
                console.log('✅ [Content] Bug detection complete:', report);
                sendResponse({ success: true, report });
            } catch (error: any) {
                console.error('❌ [Content] Bug detection error:', error);
                sendResponse({ success: false, error: error.message || String(error) });
            }
        })();

        return true; // Keep channel open for async response
    }

    // Execute action handler
    if (request.type === 'EXECUTE_ACTION') {
        const action = request.action;
        try {
            if (action.type === 'CLICK') {
                const el = document.querySelector(action.selector);
                if (el) {
                    (el as HTMLElement).click();
                    (el as HTMLElement).style.border = '2px solid red';
                    setTimeout(() => (el as HTMLElement).style.border = '', 1000);
                    sendResponse({ success: true });
                } else {
                    throw new Error(`Element not found: ${action.selector}`);
                }
            } else if (action.type === 'TYPE') {
                const el = document.querySelector(action.selector);
                if (el) {
                    (el as HTMLInputElement).value = action.text;
                    (el as HTMLInputElement).dispatchEvent(new Event('input', { bubbles: true }));
                    sendResponse({ success: true });
                } else {
                    throw new Error(`Element not found: ${action.selector}`);
                }
            } else if (action.type === 'SCROLL') {
                window.scrollBy(0, 500);
                sendResponse({ success: true });
            } else {
                sendResponse({ success: true, message: 'No executable action or finished.' });
            }
        } catch (e: any) {
            sendResponse({ success: false, error: e.message });
        }
        return true;
    }

    // Capture full page screenshots
    if (request.type === 'CAPTURE_FULL_PAGE') {
        captureFullPageScreenshots(sendResponse);
        return true;
    }

    return true;
});

/**
 * Capture full page screenshots by scrolling
 */
async function captureFullPageScreenshots(sendResponse: (response: any) => void) {
    console.log('📸 Starting full page screenshot capture...');

    try {
        const screenshots: string[] = [];
        const scrollStep = window.innerHeight * 0.9; // 90% of viewport for overlap
        const totalHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );

        // Save current scroll position
        const originalScrollY = window.scrollY;

        console.log(`📏 Page dimensions: ${totalHeight}px tall, viewport: ${window.innerHeight}px`);
        console.log(`🔢 Estimated screenshots needed: ${Math.ceil(totalHeight / scrollStep)}`);

        // Scroll to top first
        window.scrollTo(0, 0);
        await new Promise(resolve => setTimeout(resolve, 300));

        // Capture screenshots while scrolling
        let currentScroll = 0;
        while (currentScroll < totalHeight) {
            // Request screenshot capture from background
            const screenshot = await chrome.runtime.sendMessage({ type: 'CAPTURE_VIEWPORT' });
            if (screenshot) {
                screenshots.push(screenshot);
            }

            // Scroll down
            currentScroll += scrollStep;
            window.scrollTo(0, currentScroll);
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Restore scroll position
        window.scrollTo(0, originalScrollY);

        console.log(`✅ Captured ${screenshots.length} screenshots`);
        sendResponse({
            success: true,
            screenshots,
            metadata: {
                totalHeight,
                viewportHeight: window.innerHeight,
                screenshotCount: screenshots.length
            }
        });

    } catch (error: any) {
        console.error('❌ Screenshot capture failed:', error);
        sendResponse({ success: false, error: error.message });
    }
}
