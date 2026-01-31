import { createOpenAIClient, AGENT_SYSTEM_PROMPT } from './services/openai';

console.log("Visual QA Agent: Background Service Worker Loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'START_AGENT') {
        handleStartAgent(request.goal, sendResponse);
        return true; // Keep channel open for async response
    }
});

async function handleStartAgent(goal: string, sendResponse: (response: any) => void) {
    console.log("Received goal:", goal);
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab.id) throw new Error("No active tab found");

        // 1. Capture Screenshot
        console.log("Capturing screenshot...");
        const screenshotUrl = await chrome.tabs.captureVisibleTab(tab.windowId || chrome.windows.WINDOW_ID_CURRENT, { format: 'jpeg' });

        // 2. Get DOM
        console.log("Fetching DOM from content script...");
        let domResponse;
        try {
            domResponse = await chrome.tabs.sendMessage(tab.id, { type: 'GET_DOM' });
        } catch (e) {
            console.warn("Content script unreachable, maybe injecting now?", e);
            throw new Error("Could not connect to page. Refresh the page and try again.");
        }

        // 3. Call OpenAI
        console.log("Calling OpenAI...");
        const client = await createOpenAIClient();
        const completion = await client.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: AGENT_SYSTEM_PROMPT },
                {
                    role: "user", content: [
                        { type: "text", text: `Goal: ${goal}\n\nPage Context (Simplified):\n${domResponse.dom}` },
                        { type: "image_url", image_url: { url: screenshotUrl } }
                    ]
                }
            ],
            max_tokens: 300,
            response_format: { type: "json_object" }
        });

        const actionContent = completion.choices[0].message.content;
        console.log("Agent decided:", actionContent);

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
        console.error("Agent Error:", error);
        sendResponse({ success: false, error: error.message || String(error) });
    }
}
