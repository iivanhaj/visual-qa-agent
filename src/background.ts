import { createOpenAIClient, AGENT_SYSTEM_PROMPT } from './services/openai';
import { TestType, BugReport } from './types';

console.log("✅ Visual QA Agent: Enhanced Background Service Worker Loaded");
console.log("⏰ Timestamp:", new Date().toISOString());

// Open sidebar when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
    console.log("🔘 Extension icon clicked, opening sidebar...");
    chrome.sidePanel.open({ windowId: tab.windowId });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'START_AGENT') {
        handleStartAgent(request.goal, sendResponse);
        return true; // Keep channel open for async response
    } else if (request.type === 'RUN_BUG_DETECTION') {
        handleBugDetection(request.tests, sendResponse);
        return true;
    } else if (request.type === 'CAPTURE_VIEWPORT') {
        // Capture current viewport screenshot
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.windowId !== undefined) {
                chrome.tabs.captureVisibleTab(tabs[0].windowId,
                    { format: 'jpeg', quality: 85 },
                    (dataUrl) => {
                        if (chrome.runtime.lastError) {
                            console.error("Screenshot error:", chrome.runtime.lastError);
                            sendResponse({ success: false, error: chrome.runtime.lastError.message });
                        } else {
                            sendResponse({ success: true, screenshot: dataUrl });
                        }
                    }
                );
            } else {
                sendResponse({ success: false, error: "No active window" });
            }
        });
        return true; // Keep channel open
    }
});

async function handleBugDetection(tests: TestType[], sendResponse: (response: any) => void) {
    console.log("🔍 [Background] Starting bug detection for tests:", tests);

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab.id) throw new Error("No active tab found");

        // Send message to content script to run tests
        console.log("📤 [Background] Sending message to content script on tab:", tab.id);
        const response = await chrome.tabs.sendMessage(tab.id, {
            type: 'RUN_BUG_DETECTION',
            tests: tests
        });

        console.log("📥 [Background] Received response from content script:", response);
        sendResponse(response);

    } catch (error: any) {
        console.error("❌ [Background] Bug detection error:", error);
        sendResponse({ success: false, error: error.message || String(error) });
    }
}

async function handleStartAgent(goal: string, sendResponse: (response: any) => void) {
    console.log("🎯 [Background] Starting agent with goal:", goal);
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab.id) throw new Error("No active tab found");

        // 1. Capture Full Page Screenshots
        console.log("📸 [Background] Requesting full page screenshots...");
        const screenshotResponse = await chrome.tabs.sendMessage(tab.id, {
            type: 'CAPTURE_FULL_PAGE'
        });

        if (!screenshotResponse.success) {
            throw new Error("Failed to capture screenshots: " + screenshotResponse.error);
        }

        console.log(`✅ [Background] Captured ${screenshotResponse.screenshots.length} screenshots`);
        console.log(`📏 [Background] Page height: ${screenshotResponse.metadata.totalHeight}px`);

        // 2. Get DOM
        console.log("🌐 [Background] Fetching DOM from content script...");
        let domResponse;
        try {
            domResponse = await chrome.tabs.sendMessage(tab.id, { type: 'GET_DOM' });
        } catch (e) {
            console.warn("Content script unreachable:", e);
            throw new Error("Could not connect to page. Refresh the page and try again.");
        }

        // 3. Call OpenAI with all screenshots
        console.log("🤖 [Background] Calling OpenAI with full page context...");
        const client = await createOpenAIClient();

        // Build messages with all screenshots
        const imageContent = screenshotResponse.screenshots.map((screenshot: string) => ({
            type: "image_url" as const,
            image_url: { url: screenshot }
        }));

        const completion = await client.chat.completions.create({
            model: "gpt-5-mini-2025-08-07",
            messages: [
                { role: "system", content: AGENT_SYSTEM_PROMPT },
                {
                    role: "user", content: [
                        {
                            type: "text",
                            text: `Goal: ${goal}\n\nI'm providing ${screenshotResponse.screenshots.length} screenshots of the entire page (scrolled from top to bottom).\n\nPage Context (Simplified):\n${domResponse.dom}`
                        },
                        ...imageContent
                    ]
                }
            ],
            max_completion_tokens: 500,
            response_format: { type: "json_object" }
        });

        const actionContent = completion.choices[0].message.content;
        console.log("🎬 [Background] Agent decided:", actionContent);

        let actionObj;
        try {
            actionObj = JSON.parse(actionContent || "{}");
        } catch (e) {
            console.error("Failed to parse JSON:", actionContent);
            throw new Error("Invalid response from Agent");
        }

        // 4. Send action to content script
        if (actionObj.type !== 'FINISH') {
            await chrome.tabs.sendMessage(tab.id, { type: 'EXECUTE_ACTION', action: actionObj });
        }

        sendResponse({ success: true, action: actionObj });

    } catch (error: any) {
        console.error("❌ [Background] Agent Error:", error);
        sendResponse({ success: false, error: error.message || String(error) });
    }
}
