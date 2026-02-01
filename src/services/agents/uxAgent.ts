import { Agent, AgentFindings, PageContext } from './baseAgent';
import { Issue, Severity } from '../../types';

/**
 * UX/Design Agent
 * User experience & design reviewer using GPT-4 Vision
 */
export class UXAgent extends Agent {
    id = 'ux';
    name = 'UX/Design Agent';
    emoji = '📱';
    systemPrompt = `You are a senior UX designer and design systems expert.
Your role is to evaluate user interface design, visual hierarchy, and user experience.
Focus on: visual hierarchy, consistency, mobile responsiveness, touch targets, readability, and design patterns.
Provide specific, actionable design improvements that enhance user experience.`;

    async analyze(context: PageContext): Promise<AgentFindings> {
        this.startTime = Date.now();
        this.updateProgress('Analyzing UX and design...', 10);

        const findings: AgentFindings = {
            agentId: this.id,
            agentName: this.name,
            category: 'ux',
            issues: [],
            suggestions: [],
            confidence: 0.75,
            analysisTime: 0,
            metadata: {
                elementsChecked: 0
            }
        };

        try {
            const issues: Issue[] = [];

            // 1. Check viewport meta tag (mobile responsiveness)
            this.updateProgress('Checking mobile responsiveness...', 20);
            const viewportMeta = context.dom.querySelector('meta[name="viewport"]');
            if (!viewportMeta) {
                issues.push({
                    type: 'ux',
                    severity: Severity.High,
                    title: 'Missing Viewport Meta Tag',
                    description: 'Page lacks viewport meta tag, likely not mobile-optimized.',
                    location: '<head>',
                    suggestion: 'Add: <meta name="viewport" content="width=device-width, initial-scale=1">',
                    resources: ['https://web.dev/responsive-web-design-basics/']
                });
            }

            // 2. Check touch target sizes
            this.updateProgress('Checking touch target sizes...', 35);
            const buttons = Array.from(context.dom.querySelectorAll('button, a, [role="button"]'));
            const smallTargets = buttons.filter(btn => {
                const rect = btn.getBoundingClientRect();
                return (rect.width < 44 || rect.height < 44) && rect.width > 0; // Apple/Google recommend 44x44px min
            });

            if (smallTargets.length > 0) {
                issues.push({
                    type: 'ux',
                    severity: Severity.Medium,
                    title: 'Small Touch Targets',
                    description: `${smallTargets.length} interactive elements are smaller than recommended 44x44px touch target size.`,
                    location: 'Buttons/Links',
                    suggestion: 'Increase padding/size to at least 44x44px for better mobile usability',
                    resources: ['https://web.dev/accessible-tap-targets/']
                });
            }

            // 3. Check for consistent spacing
            this.updateProgress('Analyzing visual consistency...', 50);
            const allElements = Array.from(context.dom.querySelectorAll('div, section, article, header, footer'));
            findings.suggestions.push(`Page has ${allElements.length} layout elements`);

            // 4. Check text readability
            this.updateProgress('Checking text readability...', 65);
            const paragraphs = Array.from(context.dom.querySelectorAll('p'));
            const longParagraphs = paragraphs.filter(p => {
                const text = p.textContent || '';
                return text.length > 500; // Long paragraph
            });

            if (longParagraphs.length > 0) {
                issues.push({
                    type: 'ux',
                    severity: Severity.Low,
                    title: 'Long Text Blocks',
                    description: `${longParagraphs.length} paragraphs have >500 characters, which can reduce readability.`,
                    location: 'Content',
                    suggestion: 'Break up long paragraphs, use subheadings, bullet points for scannability',
                    resources: ['https://www.nngroup.com/articles/how-users-read-on-the-web/']
                });
            }

            // 5. Check for CTA visibility
            const ctaKeywords = ['buy', 'sign up', 'subscribe', 'get started', 'download', 'try'];
            const potentialCTAs = buttons.filter(btn => {
                const text = btn.textContent?.toLowerCase() || '';
                return ctaKeywords.some(keyword => text.includes(keyword));
            });

            findings.suggestions.push(`Found ${potentialCTAs.length} potential call-to-action buttons`);

            // 6. AI Vision Analysis (if screenshots available)
            this.updateProgress('Running AI visual analysis...', 80);
            if (context.screenshots && context.screenshots.length > 0) {
                try {
                    const aiAnalysis = await this.callAI(
                        `Analyze the design and UX of this webpage based on the screenshots.
                        
Page info:
- ${buttons.length} interactive elements (${smallTargets.length} too small)
- ${paragraphs.length} paragraphs (${longParagraphs.length} too long)
- ${potentialCTAs.length} call-to-action buttons
- Mobile optimized: ${viewportMeta ? 'Yes' : 'No'}

Provide:
1. Visual hierarchy assessment (1-2 sentences)
2. Top 3 UX improvements
3. Design consistency feedback

Keep total response under 200 words.`,
                        true, // use vision
                        context.screenshots.slice(0, 3) // Max 3 screenshots
                    );

                    findings.suggestions.push(aiAnalysis);
                    findings.confidence = 0.90; // Higher with vision
                } catch (error) {
                    console.warn(`${this.emoji} AI vision analysis failed:`, error);
                }
            } else {
                findings.suggestions.push(
                    `UX check complete (without screenshots)`,
                    `Mobile meta tag: ${viewportMeta ? '✓' : '✗'}`,
                    `Touch targets: ${smallTargets.length}/${buttons.length} need adjustment`
                );
            }

            findings.issues = issues;
            findings.metadata.elementsChecked = buttons.length + paragraphs.length + allElements.length;
            this.updateProgress('Complete!', 100);

        } catch (error: any) {
            console.error(`❌ ${this.emoji} ${this.name} error:`, error);
            findings.confidence = 0.3;
            findings.suggestions.push(`Error during analysis: ${error.message}`);
        }

        findings.analysisTime = Date.now() - this.startTime;
        this.reportFindings(findings);

        return findings;
    }
}
