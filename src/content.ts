console.log("Visual QA Agent: Content Script Loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_DOM') {
        // Simple text extraction for now. 
        // In a real agent, we would traverse the DOM and create a simplified accessibility tree.
        const bodyText = document.body.innerText.substring(0, 10000); // Limit context
        sendResponse({ dom: bodyText });
    } else if (request.type === 'EXECUTE_ACTION') {
        const action = request.action;
        console.log("Executing action:", action);

        try {
            if (action.type === 'CLICK') {
                const el = document.querySelector(action.selector);
                if (el) {
                    (el as HTMLElement).click();
                    // Add a visual indicator
                    (el as HTMLElement).style.border = "3px solid red";
                    setTimeout(() => (el as HTMLElement).style.border = "", 1000);
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
                sendResponse({ success: true, message: "No executable action or finished." });
            }
        } catch (e: any) {
            sendResponse({ success: false, error: e.message });
        }
    }
    return true;
});
