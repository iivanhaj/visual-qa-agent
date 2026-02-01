import { BugReport, Issue, TestResult, TestType, HealthScore, IssueType, Severity } from '../types';
import { SEOAnalyzer } from './seoAnalyzer';
import { AccessibilityChecker } from './accessibilityChecker';
import { PerformanceAnalyzer } from './performanceAnalyzer';
import { AISuggestionService } from './aiSuggestionService';

/**
 * Main Bug Detection Service - Orchestrates all testing
 */
export class BugDetectionService {
    private document: Document;
    private aiService: AISuggestionService;

    constructor(doc: Document) {
        this.document = doc;
        this.aiService = new AISuggestionService();
    }

    /**
     * Run all selected tests and generate a comprehensive bug report
     */
    async runTests(selectedTests: TestType[]): Promise<BugReport> {
        const testResults: TestResult[] = [];
        const allIssues: Issue[] = [];

        // Initialize AI service
        await this.aiService.initialize();

        for (const testType of selectedTests) {
            const startTime = Date.now();
            let issues: Issue[] = [];

            try {
                switch (testType) {
                    case TestType.Links:
                        issues = this.testLinks();
                        break;
                    case TestType.Buttons:
                        issues = this.testButtons();
                        break;
                    case TestType.Forms:
                        issues = this.testForms();
                        break;
                    case TestType.Responsive:
                        issues = this.testResponsive();
                        break;
                    case TestType.SEO:
                        issues = new SEOAnalyzer(this.document).analyze();
                        break;
                    case TestType.Accessibility:
                        issues = new AccessibilityChecker(this.document).analyze();
                        break;
                    case TestType.Performance:
                        issues = new PerformanceAnalyzer(this.document).analyze();
                        break;
                    case TestType.Images:
                        issues = this.testImages();
                        break;
                    case TestType.Security:
                        issues = this.testSecurity();
                        break;
                }

                const duration = Date.now() - startTime;
                const totalChecks = this.getCheckCount(testType);
                const failedChecks = issues.length;
                const passedChecks = totalChecks - failedChecks;

                testResults.push({
                    testType,
                    passed: failedChecks === 0,
                    totalChecks,
                    passedChecks,
                    failedChecks,
                    issues,
                    duration,
                    timestamp: new Date()
                });

                allIssues.push(...issues);
            } catch (error) {
                console.error(`Error running ${testType} test:`, error);
            }
        }

        // 🤖 AI Enhancement: Enhance critical/high issues with AI-generated suggestions
        console.log('🤖 Enhancing critical issues with AI...');
        const pageContext = {
            url: window.location.href,
            title: this.document.title || 'Untitled Page'
        };

        const enhancedIssues = await this.aiService.enhanceCriticalIssues(allIssues, pageContext);

        const healthScore = this.calculateHealthScore(enhancedIssues);
        const summary = this.generateSummary(enhancedIssues);

        return {
            url: window.location.href,
            timestamp: new Date(),
            healthScore,
            testResults,
            allIssues: enhancedIssues,
            summary
        };
    }

    private testLinks(): Issue[] {
        const issues: Issue[] = [];
        const links = this.document.querySelectorAll('a');

        links.forEach(link => {
            const href = link.getAttribute('href');

            // Check for missing href
            if (!href) {
                issues.push({
                    id: crypto.randomUUID(),
                    type: IssueType.Functionality,
                    severity: Severity.Medium,
                    title: 'Link Missing href Attribute',
                    description: 'Anchor tag has no href attribute.',
                    location: this.getElementPath(link),
                    element: link.outerHTML,
                    suggestion: 'Add a valid href attribute or use a button element instead.',
                    codeSnippet: {
                        before: '<a>Click here</a>',
                        after: '<a href="/destination">Click here</a>'
                    }
                });
            }
            // Check for placeholder links
            else if (href === '#' || href === 'javascript:void(0)' || href === '') {
                issues.push({
                    id: crypto.randomUUID(),
                    type: IssueType.Functionality,
                    severity: Severity.Medium,
                    title: 'Placeholder Link Detected',
                    description: `Link has placeholder href: "${href}"`,
                    location: this.getElementPath(link),
                    element: link.outerHTML,
                    suggestion: 'Replace with actual destination URL or use a button if this is meant to be interactive.',
                    codeSnippet: {
                        before: `<a href="${href}">Click</a>`,
                        after: '<a href="/actual-destination">Click</a>'
                    }
                });
            }
            // Check for broken internal links (starting with /)
            else if (href.startsWith('/') && href.length > 1) {
                // Note: We can't actually test if the link is broken without making a request,
                // but we can flag suspicious patterns
                if (href.includes('undefined') || href.includes('null')) {
                    issues.push({
                        id: crypto.randomUUID(),
                        type: IssueType.Functionality,
                        severity: Severity.High,
                        title: 'Potentially Broken Link',
                        description: `Link contains suspicious pattern: "${href}"`,
                        location: this.getElementPath(link),
                        element: link.outerHTML,
                        suggestion: 'Verify this link URL is correct and properly constructed.'
                    });
                }
            }

            // Check for links without text content
            if (!link.textContent?.trim() && !link.querySelector('img') && !link.hasAttribute('aria-label')) {
                issues.push({
                    id: crypto.randomUUID(),
                    type: IssueType.Accessibility,
                    severity: Severity.High,
                    title: 'Link Has No Text Content',
                    description: 'Link is empty and has no accessible name.',
                    location: this.getElementPath(link),
                    element: link.outerHTML,
                    suggestion: 'Add text content, an image with alt text, or an aria-label attribute.'
                });
            }
        });

        return issues;
    }

    private testButtons(): Issue[] {
        const issues: Issue[] = [];
        const buttons = this.document.querySelectorAll('button, [role="button"]');

        buttons.forEach(button => {
            // Check for buttons without type attribute
            if (button.tagName === 'BUTTON' && !button.hasAttribute('type')) {
                issues.push({
                    id: crypto.randomUUID(),
                    type: IssueType.BestPractice,
                    severity: Severity.Low,
                    title: 'Button Missing Type Attribute',
                    description: 'Button element lacks explicit type attribute (defaults to "submit").',
                    location: this.getElementPath(button),
                    element: button.outerHTML,
                    suggestion: 'Add type="button", type="submit", or type="reset" to be explicit.',
                    codeSnippet: {
                        before: '<button>Click</button>',
                        after: '<button type="button">Click</button>'
                    }
                });
            }

            // Check for div/span with role=button but missing tabindex
            if (button.tagName !== 'BUTTON' && !button.hasAttribute('tabindex')) {
                issues.push({
                    id: crypto.randomUUID(),
                    type: IssueType.Accessibility,
                    severity: Severity.High,
                    title: 'Custom Button Not Keyboard Accessible',
                    description: 'Element with role="button" lacks tabindex for keyboard access.',
                    location: this.getElementPath(button),
                    element: button.outerHTML,
                    suggestion: 'Add tabindex="0" or use a native <button> element instead.',
                    codeSnippet: {
                        before: '<div role="button">Click</div>',
                        after: '<div role="button" tabindex="0">Click</div>'
                    }
                });
            }
        });

        return issues;
    }

    private testForms(): Issue[] {
        const issues: Issue[] = [];
        const forms = this.document.querySelectorAll('form');

        forms.forEach(form => {
            // Check for forms without action or method
            if (!form.hasAttribute('action')) {
                issues.push({
                    id: crypto.randomUUID(),
                    type: IssueType.BestPractice,
                    severity: Severity.Low,
                    title: 'Form Missing Action Attribute',
                    description: 'Form has no action attribute specified.',
                    location: this.getElementPath(form),
                    element: form.outerHTML.substring(0, 200),
                    suggestion: 'Add an action attribute or handle submission via JavaScript preventDefault.'
                });
            }

            // Check for password fields without autocomplete
            const passwordInputs = form.querySelectorAll('input[type="password"]');
            passwordInputs.forEach(input => {
                if (!input.hasAttribute('autocomplete')) {
                    issues.push({
                        id: crypto.randomUUID(),
                        type: IssueType.Security,
                        severity: Severity.Low,
                        title: 'Password Field Missing Autocomplete',
                        description: 'Password input lacks autocomplete attribute for better UX.',
                        location: this.getElementPath(input),
                        element: input.outerHTML,
                        suggestion: 'Add autocomplete="current-password" or "new-password" attribute.',
                        codeSnippet: {
                            before: '<input type="password" name="password">',
                            after: '<input type="password" name="password" autocomplete="current-password">'
                        }
                    });
                }
            });
        });

        return issues;
    }

    private testResponsive(): Issue[] {
        const issues: Issue[] = [];

        // Check for fixed width containers
        const elements = this.document.querySelectorAll('*');
        let fixedWidthCount = 0;

        elements.forEach(element => {
            const style = window.getComputedStyle(element);
            const width = style.width;

            // Check for large fixed pixel widths
            if (width && width.endsWith('px')) {
                const pixelValue = parseInt(width);
                if (pixelValue > 1200) {
                    fixedWidthCount++;
                }
            }
        });

        if (fixedWidthCount > 5) {
            issues.push({
                id: crypto.randomUUID(),
                type: IssueType.BestPractice,
                severity: Severity.Medium,
                title: 'Multiple Fixed-Width Elements',
                description: `Found ${fixedWidthCount} elements with large fixed pixel widths that may not be responsive.`,
                location: 'body',
                suggestion: 'Use relative units (%, vw, rem) or max-width instead of fixed widths for better responsiveness.'
            });
        }

        return issues;
    }

    private testImages(): Issue[] {
        const issues: Issue[] = [];
        const images = this.document.querySelectorAll('img');

        images.forEach(img => {
            // Check for broken images
            if (img.complete && img.naturalHeight === 0) {
                issues.push({
                    id: crypto.randomUUID(),
                    type: IssueType.Functionality,
                    severity: Severity.High,
                    title: 'Broken Image',
                    description: `Image failed to load: ${img.src}`,
                    location: this.getElementPath(img),
                    element: img.outerHTML,
                    suggestion: 'Verify the image URL is correct and the file exists.'
                });
            }
        });

        return issues;
    }

    private testSecurity(): Issue[] {
        const issues: Issue[] = [];

        // Check for mixed content (HTTP resources on HTTPS page)
        if (window.location.protocol === 'https:') {
            const scripts = this.document.querySelectorAll('script[src]');
            const links = this.document.querySelectorAll('link[href]');
            const images = this.document.querySelectorAll('img[src]');

            [...scripts, ...links, ...images].forEach(element => {
                const url = element.getAttribute('src') || element.getAttribute('href');
                if (url && url.startsWith('http://')) {
                    issues.push({
                        id: crypto.randomUUID(),
                        type: IssueType.Security,
                        severity: Severity.High,
                        title: 'Mixed Content Detected',
                        description: `Insecure HTTP resource on HTTPS page: ${url}`,
                        location: this.getElementPath(element),
                        element: element.outerHTML,
                        suggestion: 'Change to HTTPS URL or use protocol-relative URLs (//).',
                        resources: ['https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content']
                    });
                }
            });
        }

        // Check for forms with action="http://"
        const forms = this.document.querySelectorAll('form[action]');
        forms.forEach(form => {
            const action = form.getAttribute('action');
            if (action && action.startsWith('http://')) {
                issues.push({
                    id: crypto.randomUUID(),
                    type: IssueType.Security,
                    severity: Severity.Critical,
                    title: 'Insecure Form Submission',
                    description: 'Form submits data over insecure HTTP connection.',
                    location: this.getElementPath(form),
                    suggestion: 'Change form action to HTTPS to protect user data.',
                    resources: ['https://web.dev/security-headers/']
                });
            }
        });

        return issues;
    }

    private calculateHealthScore(issues: Issue[]): HealthScore {
        const weights = {
            [Severity.Critical]: 20,
            [Severity.High]: 10,
            [Severity.Medium]: 5,
            [Severity.Low]: 2,
            [Severity.Info]: 1
        };

        let totalDeduction = 0;
        issues.forEach(issue => {
            totalDeduction += weights[issue.severity];
        });

        const overall = Math.max(0, 100 - totalDeduction);

        // Calculate category-specific scores
        const byType = this.groupIssuesByType(issues);

        return {
            overall,
            functionality: this.getTypeScore(byType[IssueType.Functionality] || []),
            accessibility: this.getTypeScore(byType[IssueType.Accessibility] || []),
            performance: this.getTypeScore(byType[IssueType.Performance] || []),
            seo: this.getTypeScore(byType[IssueType.SEO] || []),
            security: this.getTypeScore(byType[IssueType.Security] || [])
        };
    }

    private getTypeScore(issues: Issue[]): number {
        if (issues.length === 0) return 100;

        const weights = {
            [Severity.Critical]: 25,
            [Severity.High]: 15,
            [Severity.Medium]: 8,
            [Severity.Low]: 3,
            [Severity.Info]: 1
        };

        let deduction = 0;
        issues.forEach(issue => deduction += weights[issue.severity]);

        return Math.max(0, 100 - deduction);
    }

    private groupIssuesByType(issues: Issue[]): Record<IssueType, Issue[]> {
        const grouped: any = {};
        issues.forEach(issue => {
            if (!grouped[issue.type]) grouped[issue.type] = [];
            grouped[issue.type].push(issue);
        });
        return grouped;
    }

    private generateSummary(issues: Issue[]) {
        return {
            totalIssues: issues.length,
            criticalCount: issues.filter(i => i.severity === Severity.Critical).length,
            highCount: issues.filter(i => i.severity === Severity.High).length,
            mediumCount: issues.filter(i => i.severity === Severity.Medium).length,
            lowCount: issues.filter(i => i.severity === Severity.Low).length,
            infoCount: issues.filter(i => i.severity === Severity.Info).length
        };
    }

    private getCheckCount(testType: TestType): number {
        // Approximate number of checks per test type
        const counts: Record<TestType, number> = {
            [TestType.Links]: this.document.querySelectorAll('a').length,
            [TestType.Buttons]: this.document.querySelectorAll('button, [role="button"]').length,
            [TestType.Forms]: this.document.querySelectorAll('form, input, textarea, select').length,
            [TestType.Responsive]: 10,
            [TestType.SEO]: 15,
            [TestType.Accessibility]: 20,
            [TestType.Performance]: 12,
            [TestType.Console]: 1,
            [TestType.Images]: this.document.querySelectorAll('img').length,
            [TestType.Security]: 10
        };
        return counts[testType] || 10;
    }

    private getElementPath(element: Element): string {
        const path: string[] = [];
        let current: Element | null = element;

        while (current && current !== this.document.documentElement) {
            let selector = current.tagName.toLowerCase();
            if (current.id) {
                selector += `#${current.id}`;
                path.unshift(selector);
                break;
            } else if (current.className) {
                const classes = Array.from(current.classList).slice(0, 2).join('.');
                if (classes) selector += `.${classes}`;
            }
            path.unshift(selector);
            current = current.parentElement;
        }

        return path.join(' > ');
    }
}
