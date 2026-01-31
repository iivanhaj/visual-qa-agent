import OpenAI from 'openai';

export async function analyzeScreenshot(apiKey, base64Image, domContext) {
    const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Required for client-side extensions
    });

    const systemPrompt = `
You are an expert UI/UX Quality Assurance Engineer. 
Your goal is to analyze the provided screenshot and DOM context of a webpage to identify:
1. Visual Bugs (misalignments, broken layout).
2. Accessibility Issues (low contrast, missing labels).
3. Usability Improvements (confusing elements).

Return a JSON object with a "issues" array. Each issue should have:
- id: unique string
- type: "visual" | "accessibility" | "usability" | "content"
- severity: "critical" | "warning" | "info"
- title: Short summary
- description: Detailed explanation
- suggestion: How to fix it
- selector: specific CSS selector if applicable (from DOM context)
`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: systemPrompt
            },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `Analyze this UI. DOM Context: ${JSON.stringify(domContext).slice(0, 5000)}` // Truncate to avoid context limit if huge
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: base64Image,
                            detail: "high"
                        }
                    }
                ]
            }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
    });

    return JSON.parse(response.choices[0].message.content);
}
