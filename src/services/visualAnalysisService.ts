import { createOpenAIClient } from './openai';
import { Issue, Severity, IssueType } from '../types';

/**
 * Visual Analysis Service
 * Uses GPT-5.2 Vision to analyze screenshots for visual/UX issues
 */
export class VisualAnalysisService {
    /**
     * Analyze full-page screenshots for visual issues
     */
    async analyzeScreenshots(screenshots: string[], url: string): Promise<Issue[]> {
        console.log(`🖼️ [VisualAnalysis] Analyzing ${screenshots.length} screenshots...`);

        const issues: Issue[] = [];

        try {
            const client = await createOpenAIClient();

            // Build image content for vision API
            const imageContent = screenshots.map(screenshot => ({
                type: 'image_url' as const,
                image_url: {
                    url: screenshot,
                    detail: 'high' as const
                }
            }));

            const prompt = `You are a UI/UX expert analyzing a webpage for visual and design issues.

I'm providing ${screenshots.length} screenshot(s) of the entire page (scrolled from top to bottom).

Analyze the page for the following VISUAL issues:

1. **Layout Issues:**
   - Broken layouts, overlapping elements
   - Misaligned components
   - Inconsistent spacing/padding
   - Responsive design problems

2. **Design Issues:**
   - Poor color contrast (accessibility)
   - Inconsistent typography
   - Missing or broken images
   - Awkward text wrapping

3. **UX Issues:**
   - Hard-to-read text
   - Buttons that don't look clickable
   - Confusing navigation
   - Missing visual feedback

4. **Visual Bugs:**
   - Elements cut off
   - Overflowing content
   - Z-index issues
   - Missing borders/backgrounds

**IMPORTANT:** Only report ACTUAL visual issues you can SEE in the screenshots. Be specific about location.

Return your findings as a JSON array. Each issue must have:
{
  "title": "Brief title",
  "description": "What you see wrong",
  "severity": "critical" | "high" | "medium" | "low",
  "location": "Where on page (e.g., 'Header navigation', 'Main content area')",
  "suggestion": "How to fix it"
}

If the page looks perfect, return an empty array [].

Return ONLY valid JSON, no markdown formatting.`;

            const response = await client.chat.completions.create({
                model: 'gpt-5.2',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a UI/UX expert. Analyze screenshots and return ONLY valid JSON array of visual issues found.'
                    },
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: prompt },
                            ...imageContent
                        ]
                    }
                ],
                max_tokens: 2000,
                temperature: 0.3
            });

            const content = response.choices[0].message.content || '[]';
            console.log('🤖 [VisualAnalysis] AI Response:', content);

            // Parse JSON response
            let visualIssues: any[] = [];
            try {
                // Remove markdown code blocks if present
                const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                visualIssues = JSON.parse(jsonStr);
            } catch (parseError) {
                console.error('❌ [VisualAnalysis] Failed to parse AI response:', parseError);
                // Return empty array if parsing fails
                return [];
            }

            // Convert to Issue format
            visualIssues.forEach((visualIssue, index) => {
                const severityMap: Record<string, Severity> = {
                    'critical': Severity.Critical,
                    'high': Severity.High,
                    'medium': Severity.Medium,
                    'low': Severity.Low
                };

                issues.push({
                    id: `visual-${Date.now()}-${index}`,
                    type: IssueType.Visual,
                    severity: severityMap[visualIssue.severity] || Severity.Medium,
                    title: visualIssue.title || 'Visual Issue',
                    description: visualIssue.description || 'Visual problem detected',
                    location: visualIssue.location || 'Page',
                    suggestion: visualIssue.suggestion || 'Review and fix visual inconsistency',
                    element: `🖼️ Detected in screenshot analysis`,
                    resources: ['AI-powered visual analysis using GPT-5.2 Vision']
                });
            });

            console.log(`✅ [VisualAnalysis] Found ${issues.length} visual issues`);
            return issues;

        } catch (error) {
            console.error('❌ [VisualAnalysis] Error:', error);
            // Return empty array on error to not break the flow
            return [];
        }
    }

    /**
     * Capture full-page screenshots by scrolling
     */
    async captureFullPageScreenshots(tabId: number): Promise<{ screenshots: string[], metadata: any }> {
        console.log('📸 [VisualAnalysis] Capturing full-page screenshots...');

        try {
            // Send message to content script to capture
            const response = await chrome.tabs.sendMessage(tabId, {
                type: 'CAPTURE_FULL_PAGE'
            });

            if (response.success) {
                console.log(`✅ [VisualAnalysis] Captured ${response.screenshots.length} screenshots`);
                return {
                    screenshots: response.screenshots,
                    metadata: response.metadata
                };
            } else {
                throw new Error(response.error || 'Failed to capture screenshots');
            }
        } catch (error: any) {
            console.error('❌ [VisualAnalysis] Screenshot capture failed:', error);
            throw error;
        }
    }
}
