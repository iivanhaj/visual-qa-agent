import { Agent, AgentFindings, PageContext } from './baseAgent';
import { Issue, Severity } from '../../types';

/**
 * Accessibility Agent
 * WCAG 2.1 compliance expert with rule-based + AI analysis
 */
export class AccessibilityAgent extends Agent {
    id = 'accessibility';
    name = 'Accessibility Agent';
    emoji = '♿';
    model = 'gpt-4o-mini';
    systemPrompt = `You are a WCAG 2.1 accessibility auditor and expert in web accessibility for users with disabilities. 
Your role is to identify barriers that prevent people with disabilities from using websites.
Focus on: screen reader compatibility, keyboard navigation, color contrast, ARIA attributes, and semantic HTML.
Provide specific, actionable recommendations that comply with WCAG 2.1 Level AA standards.`;

    async analyze(context: PageContext): Promise<AgentFindings> {
        this.startTime = Date.now();
        this.updateProgress('Starting accessibility audit...', 5);

        const findings: AgentFindings = {
            agentId: this.id,
            agentName: this.name,
            category: 'accessibility',
            issues: [],
            suggestions: [],
            confidence: 0.9,
            analysisTime: 0,
            metadata: {
                elementsChecked: 0
            }
        };

        try {
            const issues: Issue[] = [];

            // 1. Check for missing alt text on images
            this.updateProgress('Checking image alt text...', 15);
            const images = Array.from(context.dom.querySelectorAll('img'));
            images.forEach((img, index) => {
                const alt = img.getAttribute('alt');
                if (!alt || alt.trim() === '') {
                    issues.push({
                        type: 'accessibility',
                        severity: Severity.High,
                        title: 'Missing Alt Attribute',
                        description: `Image #${index + 1} does not have an alt attribute, making it inaccessible to screen readers.`,
                        location: img.src || `img:nth-of-type(${index + 1})`,
                        element: img.outerHTML.substring(0, 100),
                        suggestion: 'Add descriptive alt text: <img src="..." alt="Description of image">',
                        resources: ['https://www.w3.org/WAI/tutorials/images/']
                    });
                }
            });

            // 2. Check for form labels
            this.updateProgress('Checking form labels...', 30);
            const inputs = Array.from(context.dom.querySelectorAll('input:not([type="hidden"]), textarea, select'));
            inputs.forEach((input, index) => {
                const id = input.getAttribute('id');
                const ariaLabel = input.getAttribute('aria-label');
                const ariaLabelledBy = input.getAttribute('aria-labelledby');

                if (!id && !ariaLabel && !ariaLabelledBy) {
                    issues.push({
                        type: 'accessibility',
                        severity: Severity.High,
                        title: 'Form Input Missing Label',
                        description: `Form control #${index + 1} has no associated label, making it difficult for screen reader users.`,
                        location: input.getAttribute('name') || `input:nth-of-type(${index + 1})`,
                        element: input.outerHTML.substring(0, 100),
                        suggestion: 'Add a <label> with matching for/id attributes or use aria-label',
                        resources: ['https://www.w3.org/WAI/tutorials/forms/labels/']
                    });
                }
            });

            // 3. Check color contrast (simplified)
            this.updateProgress('Analyzing color contrast...', 45);
            const buttons = Array.from(context.dom.querySelectorAll('button, a.btn, [role="button"]'));
            // Note: Real contrast checking requires computed styles - this is a simplified check
            findings.suggestions.push(`Found ${buttons.length} interactive elements - recommend manual contrast check`);

            // 4. Check for heading hierarchy
            this.updateProgress('Checking heading structure...', 60);
            const headings = Array.from(context.dom.querySelectorAll('h1, h2, h3, h4, h5, h6'));
            const h1Count = context.dom.querySelectorAll('h1').length;

            if (h1Count === 0) {
                issues.push({
                    type: 'accessibility',
                    severity: Severity.Medium,
                    title: 'Missing H1 Heading',
                    description: 'Page does not have a main H1 heading, which hurts accessibility and SEO.',
                    location: 'document',
                    suggestion: 'Add a single H1 heading that describes the main purpose of the page',
                    resources: ['https://www.w3.org/WAI/tutorials/page-structure/headings/']
                });
            } else if (h1Count > 1) {
                issues.push({
                    type: 'accessibility',
                    severity: Severity.Low,
                    title: 'Multiple H1 Headings',
                    description: `Found ${h1Count} H1 headings. Best practice is to have only one H1 per page.`,
                    location: 'document',
                    suggestion: 'Use only one H1 for the main page title, use H2-H6 for subsections',
                    resources: ['https://www.w3.org/WAI/tutorials/page-structure/headings/']
                });
            }

            // 5. Check for keyboard accessibility
            this.updateProgress('Checking keyboard navigation...', 75);
            const interactiveElements = context.dom.querySelectorAll('div[onclick], span[onclick]');
            interactiveElements.forEach((el, index) => {
                const tabIndex = el.getAttribute('tabindex');
                const role = el.getAttribute('role');

                if (!role && !tabIndex) {
                    issues.push({
                        type: 'accessibility',
                        severity: Severity.Medium,
                        title: 'Non-Keyboard Accessible Element',
                        description: `Element with onclick handler is not keyboard accessible.`,
                        location: `${el.tagName.toLowerCase()}:nth-of-type(${index + 1})`,
                        element: el.outerHTML.substring(0, 100),
                        suggestion: 'Add tabindex="0" and role="button", or use a <button> element instead',
                        resources: ['https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html']
                    });
                }
            });

            // 6. AI-powered insights (if available)
            this.updateProgress('Generating AI insights...', 90);
            try {
                const aiAnalysis = await this.callAI(`
I found ${issues.length} accessibility issues on this page:
- ${images.length} images (${issues.filter(i => i.title.includes('Alt')).length} missing alt text)
- ${inputs.length} form inputs
- ${headings.length} headings (${h1Count} H1s)
- ${interactiveElements.length} custom interactive elements

Provide 3 high-impact accessibility improvements this page should prioritize.
Keep each recommendation under 50 words.
                `);

                findings.suggestions.push(aiAnalysis);
                findings.confidence = 0.95; // Higher confidence with AI
            } catch (error) {
                console.warn(`${this.emoji} AI analysis failed, using rule-based only`);
                findings.suggestions.push(
                    `Checked ${images.length} images, ${inputs.length} inputs, ${headings.length} headings`,
                    `Found ${issues.length} accessibility issues`
                );
            }

            findings.issues = issues;
            findings.metadata.elementsChecked = images.length + inputs.length + headings.length;
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
