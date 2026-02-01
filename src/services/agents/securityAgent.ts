import { Agent, AgentFindings, PageContext } from './baseAgent';
import { Issue, Severity } from '../../types';

/**
 * Security Agent  
 * Vulnerability scanner with pattern matching + AI threat analysis
 */
export class SecurityAgent extends Agent {
    id = 'security';
    name = 'Security Agent';
    emoji = '🔒';
    model = 'gpt-5-mini-2025-08-07';
    systemPrompt = `You are a web security researcher and penetration tester.
Your role is to identify security vulnerabilities and potential attack vectors.
Focus on: XSS, CSRF, mixed content, insecure protocols, sensitive data exposure, and client-side security.
Provide specific remediation steps with severity assessment.`;

    async analyze(context: PageContext): Promise<AgentFindings> {
        this.startTime = Date.now();
        this.updateProgress('Starting security scan...', 10);

        const findings: AgentFindings = {
            agentId: this.id,
            agentName: this.name,
            category: 'security',
            issues: [],
            suggestions: [],
            confidence: 0.80,
            analysisTime: 0,
            metadata: {
                elementsChecked: 0
            }
        };

        try {
            const issues: Issue[] = [];
            const isHTTPS = context.url.startsWith('https://');

            // 1. Check HTTPS usage
            this.updateProgress('Checking HTTPS...', 15);
            if (!isHTTPS) {
                issues.push({
                    type: 'security',
                    severity: Severity.Critical,
                    title: 'Site Not Using HTTPS',
                    description: 'Page is served over HTTP, making it vulnerable to man-in-the-middle attacks.',
                    location: context.url,
                    suggestion: 'Implement HTTPS with a valid SSL/TLS certificate',
                    resources: ['https://web.dev/why-https-matters/']
                });
            }

            // 2. Check for mixed content
            this.updateProgress('Detecting mixed content...', 30);
            if (isHTTPS) {
                const httpImages = Array.from(context.dom.querySelectorAll('img')).filter(
                    img => img.src.startsWith('http://')
                );
                const httpScripts = Array.from(context.dom.querySelectorAll('script[src]')).filter(
                    script => (script as HTMLScriptElement).src.startsWith('http://')
                );

                if (httpImages.length > 0 || httpScripts.length > 0) {
                    issues.push({
                        type: 'security',
                        severity: Severity.High,
                        title: 'Mixed Content Detected',
                        description: `HTTPS page loading ${httpImages.length} HTTP images and ${httpScripts.length} HTTP scripts.`,
                        location: 'Resources',
                        suggestion: 'Update all resource URLs to use HTTPS or protocol-relative URLs (//)',
                        resources: ['https://developers.google.com/web/fundamentals/security/prevent-mixed-content/fixing-mixed-content']
                    });
                }
            }

            // 3. Check for inline event handlers (potential XSS vectors)
            this.updateProgress('Checking for XSS vulnerabilities...', 45);
            const inlineEvents = Array.from(context.dom.querySelectorAll('[onclick], [onload], [onerror], [onmouseover]'));

            if (inlineEvents.length > 0) {
                issues.push({
                    type: 'security',
                    severity: Severity.Medium,
                    title: 'Inline Event Handlers Found',
                    description: `Found ${inlineEvents.length} inline event handlers which can be XSS vectors.`,
                    location: 'Various elements',
                    suggestion: 'Use addEventListener() instead of inline event handlers, implement CSP',
                    resources: ['https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP']
                });
            }

            // 4. Check for sensitive data in forms
            this.updateProgress('Analyzing form security...', 60);
            const forms = Array.from(context.dom.querySelectorAll('form'));
            const insecureForms = forms.filter(form => {
                const action = form.getAttribute('action');
                const method = form.getAttribute('method')?.toLowerCase();
                return action && action.startsWith('http://') && method === 'post';
            });

            if (insecureForms.length > 0) {
                issues.push({
                    type: 'security',
                    severity: Severity.Critical,
                    title: 'Forms Submitting Over HTTP',
                    description: `${insecureForms.length} forms submit data over unencrypted HTTP.`,
                    location: 'Forms',
                    suggestion: 'Use HTTPS for all form submissions, especially those handling sensitive data',
                    resources: ['https://web.dev/why-https-matters/']
                });
            }

            // 5. Check password inputs
            const passwordInputs = Array.from(context.dom.querySelectorAll('input[type="password"]'));
            passwordInputs.forEach((input, index) => {
                const form = input.closest('form');
                const autocomplete = input.getAttribute('autocomplete');

                if (form && !isHTTPS) {
                    issues.push({
                        type: 'security',
                        severity: Severity.Critical,
                        title: 'Password Field Over HTTP',
                        description: 'Password input on non-HTTPS page exposes credentials.',
                        location: `form:nth-of-type(${index + 1})`,
                        element: input.outerHTML,
                        suggestion: 'Use HTTPS for all pages with password fields',
                        resources: ['https://web.dev/why-https-matters/']
                    });
                }
            });

            // 6. Check for external scripts
            this.updateProgress('Analyzing third-party scripts...', 75);
            const externalScripts = Array.from(context.dom.querySelectorAll('script[src]')).filter(script => {
                const src = (script as HTMLScriptElement).src;
                return src && !src.includes(window.location.hostname);
            });

            if (externalScripts.length > 5) {
                findings.suggestions.push(
                    `Found ${externalScripts.length} third-party scripts - review for supply chain risks`
                );
            }

            // 7. AI Security Analysis
            this.updateProgress('Generating security assessment...', 90);
            try {
                const aiAnalysis = await this.callAI(`
Security scan results:
- Protocol: ${isHTTPS ? 'HTTPS ✓' : 'HTTP ⚠️'}
- ${inlineEvents.length} inline event handlers
- ${forms.length} forms (${insecureForms.length} insecure)
- ${externalScripts.length} third-party scripts
- ${passwordInputs.length} password fields

Identify the top 3 security priorities for this page.
For each, provide specific mitigation steps.
Keep each under 50 words.
                `);

                findings.suggestions.push(aiAnalysis);
                findings.confidence = 0.90;
            } catch (error) {
                console.warn(`${this.emoji} AI analysis failed`);
                findings.suggestions.push(
                    `Security check complete: ${issues.length} issues found`,
                    isHTTPS ? 'HTTPS: ✓' : 'HTTPS: ✗ (Critical)'
                );
            }

            findings.issues = issues;
            findings.metadata.elementsChecked = inlineEvents.length + forms.length + externalScripts.length;
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
