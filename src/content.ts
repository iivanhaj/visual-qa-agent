import { BugDetectionService } from './services/bugDetectionService';
import { TestType, BugReport } from './types';

console.log("✅ Visual QA Agent: Enhanced Content Script Loaded");
console.log("📍 Page URL:", window.location.href);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_DOM') {
        sendResponse({ dom: getSimplifiedDOM() });
        return true;
    }

    if (request.type === 'EXECUTE_ACTION') {
        executeAction(request.action);
        sendResponse({ success: true });
        return true;
    }

    if (request.type === 'RUN_BUG_DETECTION') {
        handleBugDetection(request.tests, sendResponse);
        return true; // Keep channel open for async response
    }

    if (request.type === 'CAPTURE_FULL_PAGE') {
        captureFullPageScreenshots(sendResponse);
        return true; // Keep channel open
    }

    return false;
});

/**
 * Capture full page screenshots by scrolling
 */
async function captureFullPageScreenshots(sendResponse: (response: any) => void) {
    console.log("📸 Starting full page screenshot capture...");

    try {
        const screenshots: string[] = [];
        const scrollStep = window.innerHeight * 0.9; // 90% of viewport height for overlap
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
        await new Promise(resolve => setTimeout(resolve, 300)); // Wait for scroll

        let currentY = 0;
        let screenshotCount = 0;

        while (currentY < totalHeight) {
            console.log(`📸 Capturing screenshot ${screenshotCount + 1} at position ${currentY}px`);

            // Request screenshot from background
            const response = await chrome.runtime.sendMessage({
                type: 'CAPTURE_VIEWPORT'
            });

            if (response.success && response.screenshot) {
                screenshots.push(response.screenshot);
                screenshotCount++;
            }

            // Scroll down
            currentY += scrollStep;
            if (currentY < totalHeight) {
                window.scrollTo(0, currentY);
                await new Promise(resolve => setTimeout(resolve, 300)); // Wait for scroll and render
            }
        }

        console.log(`✅ Captured ${screenshots.length} screenshots`);

        // Restore original scroll position
        window.scrollTo(0, originalScrollY);

        sendResponse({
            success: true,
            screenshots: screenshots,
            metadata: {
                totalHeight: totalHeight,
                viewportHeight: window.innerHeight,
                screenshotCount: screenshots.length
            }
        });

    } catch (error: any) {
        console.error("❌ Full page screenshot error:", error);
        sendResponse({ success: false, error: error.message });
    }
}

function getSimplifiedDOM() {
    // Return a lightweight representation of the page
    const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
        .map(h => h.textContent?.trim())
        .filter(t => t);

    const buttons = Array.from(document.querySelectorAll('button, a'))
        .map(b => ({
            text: b.textContent?.trim(),
            href: (b as HTMLAnchorElement).href
        }))
        .slice(0, 10);

    const forms = Array.from(document.querySelectorAll('form'));

    return JSON.stringify({
        title: document.title,
        url: window.location.href,
        headings: headings.slice(0, 5),
        buttons: buttons,
        formCount: forms.length
    }, null, 2);
}

function executeAction(action: any) {
    console.log("Executing action:", action);

    switch (action.type) {
        case 'CLICK':
            const clickEl = document.querySelector(action.selector);
            if (clickEl) {
                (clickEl as HTMLElement).click();
                console.log(`Clicked: ${action.selector}`);
            } else {
                console.warn(`Element not found: ${action.selector}`);
            }
            break;

        case 'TYPE':
            const typeEl = document.querySelector(action.selector);
            if (typeEl) {
                (typeEl as HTMLInputElement).value = action.text;
                typeEl.dispatchEvent(new Event('input', { bubbles: true }));
                console.log(`Typed into: ${action.selector}`);
            } else {
                console.warn(`Element not found: ${action.selector}`);
            }
            break;

        case 'SCROLL':
            if (action.direction === 'down') {
                window.scrollBy(0, window.innerHeight * 0.8);
            } else if (action.direction === 'up') {
                window.scrollBy(0, -window.innerHeight * 0.8);
            }
            console.log(`Scrolled: ${action.direction}`);
            break;
    }
}

async function handleBugDetection(tests: TestType[], sendResponse: (response: any) => void) {
    try {
        console.log("🔍 Starting bug detection tests:", tests);
        console.log("📊 Number of tests:", tests.length);

        // Initialize bug detection service
        console.log("🚀 Initializing BugDetectionService...");
        const bugDetector = new BugDetectionService(document);

        // Send progress update
        chrome.runtime.sendMessage({
            type: 'TEST_PROGRESS',
            progress: 0,
            message: 'Initializing tests...'
        });

        // Run all tests
        console.log("⚙️ Running tests...");
        const report: BugReport = await bugDetector.runTests(tests);

        console.log("✅ Bug detection complete!");
        console.log("📊 Report summary:", {
            totalIssues: report.summary.totalIssues,
            healthScore: report.healthScore.overall,
            criticalCount: report.summary.criticalCount
        });

        // Send results back
        sendResponse({
            success: true,
            report: report
        });

    } catch (error: any) {
        console.error("❌ Bug detection error:", error);
        sendResponse({
            success: false,
            error: error.message || String(error)
        });
    }
}
