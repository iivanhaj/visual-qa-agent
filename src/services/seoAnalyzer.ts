import { Issue, IssueType, Severity } from '../types';

/**
 * SEO Analyzer - Validates meta tags, heading structure, and SEO best practices
 */
export class SEOAnalyzer {
    private document: Document;

    constructor(doc: Document) {
        this.document = doc;
    }

    analyze(): Issue[] {
        const issues: Issue[] = [];

        // Check meta tags
        issues.push(...this.checkMetaTags());

        // Check heading hierarchy
        issues.push(...this.checkHeadingHierarchy());

        // Check images for alt text
        issues.push(...this.checkImageAltText());

        // Check for Open Graph tags
        issues.push(...this.checkOpenGraphTags());

        return issues;
    }

    private checkMetaTags(): Issue[] {
        const issues: Issue[] = [];

        // Check title tag
        const title = this.document.querySelector('title');
        if (!title || !title.textContent?.trim()) {
            issues.push({
                id: crypto.randomUUID(),
                type: IssueType.SEO,
                severity: Severity.Critical,
                title: 'Missing or Empty Title Tag',
                description: 'The page is missing a title tag or it is empty. This is critical for SEO and browser tabs.',
                location: '<head>',
                suggestion: 'Add a descriptive title tag (50-60 characters) that accurately describes the page content.',
                codeSnippet: {
                    before: '<head>\n  <!-- No title tag -->',
                    after: '<head>\n  <title>Your Page Title - Brand Name</title>'
                },
                resources: ['https://moz.com/learn/seo/title-tag']
            });
        } else if (title.textContent.length > 60) {
            issues.push({
                id: crypto.randomUUID(),
                type: IssueType.SEO,
                severity: Severity.Medium,
                title: 'Title Tag Too Long',
                description: `Title tag has ${title.textContent.length} characters. Google typically displays first 50-60 characters.`,
                location: '<head> > title',
                element: title.outerHTML,
                suggestion: 'Shorten the title tag to 50-60 characters for better display in search results.',
                resources: ['https://moz.com/learn/seo/title-tag']
            });
        }

        // Check meta description
        const metaDescription = this.document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            issues.push({
                id: crypto.randomUUID(),
                type: IssueType.SEO,
                severity: Severity.High,
                title: 'Missing Meta Description',
                description: 'No meta description found. This affects how your page appears in search results.',
                location: '<head>',
                suggestion: 'Add a meta description tag (150-160 characters) that summarizes the page content.',
                codeSnippet: {
                    before: '<head>\n  <title>Page Title</title>',
                    after: '<head>\n  <title>Page Title</title>\n  <meta name="description" content="A compelling description of your page content.">'
                },
                resources: ['https://moz.com/learn/seo/meta-description']
            });
        }

        // Check viewport meta tag
        const viewport = this.document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            issues.push({
                id: crypto.randomUUID(),
                type: IssueType.SEO,
                severity: Severity.High,
                title: 'Missing Viewport Meta Tag',
                description: 'No viewport meta tag found. This is essential for mobile responsiveness.',
                location: '<head>',
                suggestion: 'Add a viewport meta tag for proper mobile display.',
                codeSnippet: {
                    before: '<head>',
                    after: '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">'
                },
                resources: ['https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag']
            });
        }

        return issues;
    }

    private checkHeadingHierarchy(): Issue[] {
        const issues: Issue[] = [];
        const h1Elements = this.document.querySelectorAll('h1');

        if (h1Elements.length === 0) {
            issues.push({
                id: crypto.randomUUID(),
                type: IssueType.SEO,
                severity: Severity.High,
                title: 'Missing H1 Heading',
                description: 'No H1 heading found on the page. Every page should have exactly one H1.',
                location: 'body',
                suggestion: 'Add a single H1 heading that describes the main topic of the page.',
                codeSnippet: {
                    before: '<body>\n  <h2>Some content</h2>',
                    after: '<body>\n  <h1>Main Page Heading</h1>\n  <h2>Some content</h2>'
                },
                resources: ['https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements']
            });
        } else if (h1Elements.length > 1) {
            issues.push({
                id: crypto.randomUUID(),
                type: IssueType.SEO,
                severity: Severity.Medium,
                title: 'Multiple H1 Headings',
                description: `Found ${h1Elements.length} H1 headings. Best practice is to have exactly one H1 per page.`,
                location: 'body',
                suggestion: 'Use only one H1 for the main page heading, and use H2-H6 for subheadings.',
                resources: ['https://www.w3.org/WAI/tutorials/page-structure/headings/']
            });
        }

        // Check for heading level skipping
        const allHeadings = Array.from(this.document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        for (let i = 1; i < allHeadings.length; i++) {
            const currentLevel = parseInt(allHeadings[i].tagName[1]);
            const previousLevel = parseInt(allHeadings[i - 1].tagName[1]);

            if (currentLevel - previousLevel > 1) {
                issues.push({
                    id: crypto.randomUUID(),
                    type: IssueType.SEO,
                    severity: Severity.Low,
                    title: 'Heading Hierarchy Skipped',
                    description: `Heading skips from H${previousLevel} to H${currentLevel}. Should increment by one level at a time.`,
                    location: this.getElementPath(allHeadings[i]),
                    element: allHeadings[i].outerHTML,
                    suggestion: 'Maintain a logical heading hierarchy without skipping levels.',
                    resources: ['https://www.w3.org/WAI/tutorials/page-structure/headings/']
                });
            }
        }

        return issues;
    }

    private checkImageAltText(): Issue[] {
        const issues: Issue[] = [];
        const images = this.document.querySelectorAll('img');

        images.forEach((img, index) => {
            if (!img.hasAttribute('alt')) {
                issues.push({
                    id: crypto.randomUUID(),
                    type: IssueType.SEO,
                    severity: Severity.Medium,
                    title: 'Image Missing Alt Attribute',
                    description: 'Image does not have an alt attribute. This hurts SEO and accessibility.',
                    location: this.getElementPath(img),
                    element: img.outerHTML,
                    suggestion: 'Add descriptive alt text to all images. Use alt="" for decorative images.',
                    codeSnippet: {
                        before: `<img src="${img.src}">`,
                        after: `<img src="${img.src}" alt="Description of the image">`
                    },
                    resources: ['https://moz.com/learn/seo/alt-text']
                });
            } else if (img.alt.trim() === '' && !img.hasAttribute('role')) {
                // Empty alt is OK for decorative images, but warn if unclear
                const src = img.src || 'unknown';
                if (!src.includes('icon') && !src.includes('decoration') && !src.includes('spacer')) {
                    issues.push({
                        id: crypto.randomUUID(),
                        type: IssueType.SEO,
                        severity: Severity.Low,
                        title: 'Image Has Empty Alt Text',
                        description: 'Image has empty alt text. Verify if this is truly decorative.',
                        location: this.getElementPath(img),
                        element: img.outerHTML,
                        suggestion: 'If the image is decorative, consider adding role="presentation". Otherwise, add descriptive alt text.',
                        resources: ['https://www.w3.org/WAI/tutorials/images/decorative/']
                    });
                }
            }
        });

        return issues;
    }

    private checkOpenGraphTags(): Issue[] {
        const issues: Issue[] = [];
        const ogTags = ['og:title', 'og:description', 'og:image', 'og:url'];
        const missingTags: string[] = [];

        ogTags.forEach(tag => {
            const element = this.document.querySelector(`meta[property="${tag}"]`);
            if (!element) {
                missingTags.push(tag);
            }
        });

        if (missingTags.length > 0) {
            issues.push({
                id: crypto.randomUUID(),
                type: IssueType.SEO,
                severity: Severity.Low,
                title: 'Missing Open Graph Tags',
                description: `Missing ${missingTags.join(', ')}. Open Graph tags improve social media sharing.`,
                location: '<head>',
                suggestion: 'Add Open Graph meta tags for better social media preview when sharing.',
                codeSnippet: {
                    before: '<head>',
                    after: `<head>
  <meta property="og:title" content="Your Page Title">
  <meta property="og:description" content="Page description">
  <meta property="og:image" content="https://example.com/image.jpg">
  <meta property="og:url" content="https://example.com/page">`
                },
                resources: ['https://ogp.me/']
            });
        }

        return issues;
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
