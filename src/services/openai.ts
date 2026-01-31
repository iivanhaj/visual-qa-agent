import OpenAI from 'openai';

// TODO: Get this from storage/settings or env
// For hackathon, we might need a way to input this from the UI
const getApiKey = async () => {
    const result = await chrome.storage.local.get(['openai_api_key']);
    return result.openai_api_key;
};

export const createOpenAIClient = async () => {
    const apiKey = await getApiKey();
    if (!apiKey) {
        throw new Error("OpenAI API Key not found. Please set it in the extension settings.");
    }

    return new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Required for Chrome Extensions
    });
};

export const AGENT_SYSTEM_PROMPT = `
You are a Visual QA Agent acting as a user on a webpage. 
Your goal is to achieve the user's objective by interacting with the page.
You will receive a description of the current page state (either DOM or screenshot analysis) and the user's goal.
You must output a JSON object with the next action to perform.

Allowed Actions:
- CLICK: { type: "CLICK", selector: "css_selector", description: "Clicking the login button" }
- TYPE: { type: "TYPE", selector: "css_selector", text: "my_password", description: "Typing password" }
- SCROLL: { type: "SCROLL", direction: "down", description: "Scrolling down to find footer" }
- FINISH: { type: "FINISH", success: true, message: "Goal achieved!" }
- ASK: { type: "ASK", question: "I am stuck, what should I do?" }
`;
