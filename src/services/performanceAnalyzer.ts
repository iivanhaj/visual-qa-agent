import { Issue, IssueType, Severity } from '../types';

/**
 * Performance Analyzer - Identifies performance issues and optimization opportunities
 */
export class PerformanceAnalyzer {
    private document: Document;

    constructor(doc: Document) {
        this.document = doc;
    }

    analyze(): Issue[] {
        const issues: Issue[] = [];

        issues.push(...this.checkDOMComplexity());
        issues.push(...this.checkImages());
        issues.push(...this.checkRenderBlockingResources());
        issues.push(...this.checkExcessiveScripts());

        return issues;
    }

    private checkDOMComplexity(): Issue[] {
        const issues: Issue[] = [];

        // Count total DOM nodes
        const allElements = this.document.querySelectorAll('*');
        const totalNodes = allElements.length;

        if (totalNodes > 1500) {
            issues.push({
                id: crypto.randomUUID(),
                type: IssueType.Performance,
                severity: totalNodes > 3000 ? Severity.High : Severity.Medium,
                title: 'Excessive DOM Size',
                description: `Page has ${totalNodes} DOM nodes. Recommended maximum is 1500 nodes.`,
                location: 'document',
                suggestion: 'Reduce DOM complexity by removing unnecessary elements, using virtual scrolling for long lists, or lazy loading content.',
                resources: [
                    'https://web.dev/dom-size/',
                    'https://developer.chrome.com/docs/lighthouse/performance/dom-size/'
                ]
            });
        }

        // Check maximum DOM depth
        const maxDepth = this.getMaxDOMDepth();
        if (maxDepth > 32) {
            issues.push({
                id: crypto.randomUUID(),
                type: IssueType.Performance,
                severity: Severity.Medium,
                title: 'Deep DOM Nesting',
                description: `Maximum DOM depth is ${maxDepth}. Recommended maximum is 32 levels.`,
                location: 'document',
                suggestion: 'Flatten DOM structure to improve rendering performance.',
                resources: ['https://web.dev/dom-size/']
            });
        }

        return issues;
    }

    private checkImages(): Issue[] {
        const issues: Issue[] = [];
        const images = this.document.querySelectorAll('img');

        let largeImageCount = 0;
        let missingLazyLoadCount = 0;

        images.forEach(img => {
            // Check for missing width/height attributes
            if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
                issues.push({
                    id: crypto.randomUUID(),
                    type: IssueType.Performance,
                    severity: Severity.Low,
                    title: 'Image Missing Dimensions',
                    description: 'Image lacks width/height attributes, which can cause layout shifts.',
                    location: this.getElementPath(img),
                    element: img.outerHTML,
                    suggestion: 'Add explicit width and height attributes to prevent Cumulative Layout Shift (CLS).',
                    codeSnippet: {
                        before: `<img src="${img.src}" alt="...">`,
                        after: `<img src="${img.src}" alt="..." width="800" height="600">`
                    },
                    resources: ['https://web.dev/cls/']
                });
            }

            // Check for lazy loading (below the fold images should use it)
            const rect = img.getBoundingClientRect();
            const isAboveFold = rect.top < window.innerHeight;

            if (!isAboveFold && !img.hasAttribute('loading')) {
                missingLazyLoadCount++;
            }

            // Estimate image size based on rendered dimensions
            const renderedArea = img.width * img.height;
            if (renderedArea > 1000000) { // Large image (>1MP)
                largeImageCount++;
            }
        });

        if (missingLazyLoadCount > 0) {
            issues.push({
                id: crypto.randomUUID(),
                type: IssueType.Performance,
                severity: Severity.Medium,
                title: 'Images Not Using Lazy Loading',
                description: `${missingLazyLoadCount} below-the-fold images are not using lazy loading.`,
                location: 'body',
                suggestion: 'Add loading="lazy" attribute to images that appear below the fold.',
                codeSnippet: {
                    before: '<img src="image.jpg" alt="...">',
                    after: '<img src="image.jpg" alt="..." loading="lazy">'
                },
                resources: ['https://web.dev/lazy-loading/']
            });
        }

        if (largeImageCount > 3) {
            issues.push({
                id: crypto.randomUUID(),
                type: IssueType.Performance,
                severity: Severity.High,
                title: 'Multiple Large Images Detected',
                description: `Found ${largeImageCount} large images that may impact page load performance.`,
                location: 'body',
                suggestion: 'Optimize images by compressing them, using modern formats (WebP, AVIF), and implementing responsive images with srcset.',
                resources: [
                    'https://web.dev/optimize-cls/',
                    'https://web.dev/use-srcset-to-automatically-choose-the-right-image/'
                ]
            });
        }

        return issues;
    }

    private checkRenderBlockingResources(): Issue[] {
        const issues: Issue[] = [];

        // Check for blocking stylesheets
        const stylesheets = this.document.querySelectorAll('link[rel="stylesheet"]');
        const blockingStylesheets: Element[] = [];

        stylesheets.forEach(link => {
            const media = link.getAttribute('media');
            // Stylesheets without media or media="all" are render-blocking
            if (!media || media === 'all' || media === 'screen') {
                blockingStylesheets.push(link);
            }
        });

        if (blockingStylesheets.length > 2) {
            issues.push({
                id: crypto.randomUUID(),
                type: IssueType.Performance,
                severity: Severity.Medium,
                title: 'Multiple Render-Blocking Stylesheets',
                description: `Found ${blockingStylesheets.length} render-blocking CSS files.`,
                location: '<head>',
                suggestion: 'Consider inlining critical CSS, combining stylesheets, or using media queries to make some non-blocking.',
                resources: [
                    'https://web.dev/extract-critical-css/',
                    'https://web.dev/defer-non-critical-css/'
                ]
            });
        }

        // Check for blocking scripts in <head>
        const blockingScripts = this.document.querySelectorAll('head script:not([async]):not([defer]):not([type="module"])');

        if (blockingScripts.length > 0) {
            issues.push({
                id: crypto.randomUUID(),
                type: IssueType.Performance,
                severity: Severity.High,
                title: 'Render-Blocking JavaScript in Head',
                description: `Found ${blockingScripts.length} synchronous scripts in <head> that block rendering.`,
                location: '<head>',
                suggestion: 'Add async or defer attributes to script tags, or move scripts to the end of <body>.',
                codeSnippet: {
                    before: '<script src="script.js"></script>',
                    after: '<script src="script.js" defer></script>'
                },
                resources: ['https://web.dev/efficiently-load-third-party-javascript/']
            });
        }

        return issues;
    }

    private checkExcessiveScripts(): Issue[] {
        const issues: Issue[] = [];
        const scripts = this.document.querySelectorAll('script[src]');

        if (scripts.length > 20) {
            issues.push({
                id: crypto.randomUUID(),
                type: IssueType.Performance,
                severity: Severity.Medium,
                title: 'Excessive Number of Scripts',
                description: `Page loads ${scripts.length} external scripts. This can impact performance.`,
                location: 'document',
                suggestion: 'Bundle and minify scripts, remove unused scripts, and use code splitting to load only what\'s needed.',
                resources: ['https://web.dev/reduce-javascript-payloads-with-code-splitting/']
            });
        }

        // Check for third-party scripts
        const thirdPartyScripts: Element[] = [];
        const pageOrigin = window.location.origin;

        scripts.forEach(script => {
            const src = script.getAttribute('src');
            if (src && !src.startsWith('/') && !src.startsWith(pageOrigin)) {
                thirdPartyScripts.push(script);
            }
        });

        if (thirdPartyScripts.length > 5) {
            issues.push({
                id: crypto.randomUUID(),
                type: IssueType.Performance,
                severity: Severity.Medium,
                title: 'Multiple Third-Party Scripts',
                description: `Found ${thirdPartyScripts.length} third-party scripts that may slow down the page.`,
                location: 'document',
                suggestion: 'Review third-party scripts and remove unnecessary ones. Use async loading and consider facade patterns for heavy widgets.',
                resources: ['https://web.dev/third-party-javascript/']
            });
        }

        return issues;
    }

    private getMaxDOMDepth(element: Element = this.document.documentElement, currentDepth: number = 0): number {
        if (element.children.length === 0) {
            return currentDepth;
        }

        let maxChildDepth = currentDepth;
        for (const child of Array.from(element.children)) {
            const childDepth = this.getMaxDOMDepth(child, currentDepth + 1);
            maxChildDepth = Math.max(maxChildDepth, childDepth);
        }

        return maxChildDepth;
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
