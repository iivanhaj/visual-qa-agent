export async function getPageContent(tabId) {
    const result = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            // Run in the context of the page
            function getSimplifiedDOM(node) {
                if (node.nodeType !== Node.ELEMENT_NODE) return null;

                // Skip hidden elements or scripts
                const style = window.getComputedStyle(node);
                if (style.display === 'none' || style.visibility === 'hidden') return null;
                if (['SCRIPT', 'STYLE', 'META', 'noscript'].includes(node.tagName)) return null;

                const simple = {
                    tag: node.tagName.toLowerCase(),
                    id: node.id || undefined,
                    class: node.className || undefined,
                    text: node.innerText?.slice(0, 50) || undefined, // Truncate text
                };

                const children = [];
                node.childNodes.forEach(child => {
                    const processed = getSimplifiedDOM(child);
                    if (processed) children.push(processed);
                });

                if (children.length > 0) simple.children = children;
                return simple;
            }

            return {
                url: window.location.href,
                title: document.title,
                dom: getSimplifiedDOM(document.body)
            };
        }
    });

    return result[0].result;
}

export async function captureTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) throw new Error("No active tab");

    // Capture screenshot (returns dataUrl)
    const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: "png" });

    // Get DOM context
    const pageContext = await getPageContent(tab.id);

    return {
        image: dataUrl,
        context: pageContext
    };
}
