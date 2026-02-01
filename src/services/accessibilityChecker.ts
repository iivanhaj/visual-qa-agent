import { Issue, IssueType, Severity } from '../types';

/**
 * Accessibility Checker - Validates WCAG 2.1 compliance
 */
export class AccessibilityChecker {
    private document: Document;

    constructor(doc: Document) {
        this.document = doc;
    }

    analyze(): Issue[] {
        const issues: Issue[] = [];

        issues.push(...this.checkImagesAccessibility());
        issues.push(...this.checkFormAccessibility());
        issues.push(...this.checkARIA());
        issues.push(...this.checkKeyboardNavigation());
        issues.push(...this.checkSemanticHTML());

        return issues;
    }

    private checkImagesAccessibility(): Issue[] {
        const issues: Issue[] = [];
        const images = this.document.querySelectorAll('img');

        images.forEach(img => {
            if (!img.hasAttribute('alt')) {
                issues.push({
                    id: crypto.randomUUID(),
                    type: IssueType.Accessibility,
                    severity: Severity.High,
                    title: 'Image Missing Alt Attribute',
                    description: 'Image lacks alt text, making it inaccessible to screen readers.',
                    location: this.getElementPath(img),
                    element: img.outerHTML,
                    suggestion: 'Add alt attribute with descriptive text. Use alt="" for decorative images.',
                    codeSnippet: {
                        before: `<img src="${img.src}">`,
                        after: `<img src="${img.src}" alt="Description of the image">`
                    },
                    resources: [
                        'https://www.w3.org/WAI/tutorials/images/',
                        'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html'
                    ]
                });
            }
        });

        return issues;
    }

    private checkFormAccessibility(): Issue[] {
        const issues: Issue[] = [];

        // Check form inputs for labels
        const inputs = this.document.querySelectorAll('input:not([type="hidden"]), textarea, select');
        inputs.forEach(input => {
            const hasLabel = this.hasAssociatedLabel(input);
            const hasAriaLabel = input.hasAttribute('aria-label') || input.hasAttribute('aria-labelledby');

            if (!hasLabel && !hasAriaLabel) {
                issues.push({
                    id: crypto.randomUUID(),
                    type: IssueType.Accessibility,
                    severity: Severity.High,
                    title: 'Form Input Missing Label',
                    description: 'Form field has no associated label, making it difficult for screen reader users.',
                    location: this.getElementPath(input),
                    element: input.outerHTML,
                    suggestion: 'Add a <label> element or aria-label attribute to describe the input field.',
                    codeSnippet: {
                        before: `<input type="text" name="email">`,
                        after: `<label for="email">Email Address:</label>\n<input type="text" id="email" name="email">`
                    },
                    resources: ['https://www.w3.org/WAI/tutorials/forms/labels/']
                });
            }
        });

        // Check for submit buttons
        const forms = this.document.querySelectorAll('form');
        forms.forEach(form => {
            const hasSubmit = form.querySelector('button[type="submit"], input[type="submit"]');
            if (!hasSubmit) {
                issues.push({
                    id: crypto.randomUUID(),
                    type: IssueType.Accessibility,
                    severity: Severity.Medium,
                    title: 'Form Missing Submit Button',
                    description: 'Form has no explicit submit button, which can confuse users.',
                    location: this.getElementPath(form),
                    suggestion: 'Add a submit button to the form.',
                    codeSnippet: {
                        before: '<form>...</form>',
                        after: '<form>\n  ...\n  <button type="submit">Submit</button>\n</form>'
                    },
                    resources: ['https://www.w3.org/WAI/tutorials/forms/']
                });
            }
        });

        return issues;
    }

    private checkARIA(): Issue[] {
        const issues: Issue[] = [];

        // Check for invalid ARIA roles
        const elementsWithRoles = this.document.querySelectorAll('[role]');
        const validRoles = [
            'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
            'cell', 'checkbox', 'columnheader', 'combobox', 'complementary',
            'contentinfo', 'definition', 'dialog', 'directory', 'document',
            'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading',
            'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main',
            'marquee', 'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox',
            'menuitemradio', 'navigation', 'none', 'note', 'option', 'presentation',
            'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup',
            'rowheader', 'scrollbar', 'search', 'searchbox', 'separator', 'slider',
            'spinbutton', 'status', 'switch', 'tab', 'table', 'tablist', 'tabpanel',
            'term', 'textbox', 'timer', 'toolbar', 'tooltip', 'tree', 'treegrid',
            'treeitem'
        ];

        elementsWithRoles.forEach(element => {
            const role = element.getAttribute('role');
            if (role && !validRoles.includes(role)) {
                issues.push({
                    id: crypto.randomUUID(),
                    type: IssueType.Accessibility,
                    severity: Severity.Medium,
                    title: 'Invalid ARIA Role',
                    description: `Element has invalid ARIA role: "${role}"`,
                    location: this.getElementPath(element),
                    element: element.outerHTML,
                    suggestion: 'Use a valid ARIA role from the WAI-ARIA specification.',
                    resources: ['https://www.w3.org/TR/wai-aria-1.2/#role_definitions']
                });
            }
        });

        // Check buttons have accessible names
        const buttons = this.document.querySelectorAll('button');
        buttons.forEach(button => {
            const hasText = button.textContent?.trim();
            const hasAriaLabel = button.hasAttribute('aria-label') || button.hasAttribute('aria-labelledby');

            if (!hasText && !hasAriaLabel) {
                issues.push({
                    id: crypto.randomUUID(),
                    type: IssueType.Accessibility,
                    severity: Severity.High,
                    title: 'Button Missing Accessible Name',
                    description: 'Button has no text content or aria-label.',
                    location: this.getElementPath(button),
                    element: button.outerHTML,
                    suggestion: 'Add text content to the button or use aria-label to provide an accessible name.',
                    codeSnippet: {
                        before: '<button><i class="icon"></i></button>',
                        after: '<button aria-label="Close">  <i class="icon"></i></button>'
                    },
                    resources: ['https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html']
                });
            }
        });

        return issues;
    }

    private checkKeyboardNavigation(): Issue[] {
        const issues: Issue[] = [];

        // Check for interactive elements with tabindex=-1 (not keyboard accessible)
        const interactiveElements = this.document.querySelectorAll(
            'a, button, input, select, textarea, [onclick], [role="button"]'
        );

        interactiveElements.forEach(element => {
            const tabindex = element.getAttribute('tabindex');
            if (tabindex === '-1' && !element.hasAttribute('disabled')) {
                issues.push({
                    id: crypto.randomUUID(),
                    type: IssueType.Accessibility,
                    severity: Severity.Medium,
                    title: 'Interactive Element Not Keyboard Accessible',
                    description: 'Element has tabindex="-1", removing it from keyboard navigation.',
                    location: this.getElementPath(element),
                    element: element.outerHTML,
                    suggestion: 'Remove tabindex="-1" or use tabindex="0" to make it keyboard accessible.',
                    resources: ['https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html']
                });
            }
        });

        // Check for positive tabindex (bad practice)
        const positiveTabindex = this.document.querySelectorAll('[tabindex]:not([tabindex="0"]):not([tabindex="-1"])');
        positiveTabindex.forEach(element => {
            const tabindex = element.getAttribute('tabindex');
            if (tabindex && parseInt(tabindex) > 0) {
                issues.push({
                    id: crypto.randomUUID(),
                    type: IssueType.Accessibility,
                    severity: Severity.Low,
                    title: 'Positive Tabindex Value',
                    description: 'Element uses positive tabindex, which can create confusing tab order.',
                    location: this.getElementPath(element),
                    element: element.outerHTML,
                    suggestion: 'Avoid positive tabindex values. Use tabindex="0" and logical DOM order instead.',
                    resources: ['https://www.a11yproject.com/posts/how-to-use-the-tabindex-attribute/']
                });
            }
        });

        return issues;
    }

    private checkSemanticHTML(): Issue[] {
        const issues: Issue[] = [];

        // Check for semantic landmark usage
        const hasMain = this.document.querySelector('main');
        const hasNav = this.document.querySelector('nav');
        const hasHeader = this.document.querySelector('header');

        if (!hasMain) {
            issues.push({
                id: crypto.randomUUID(),
                type: IssueType.Accessibility,
                severity: Severity.Medium,
                title: 'Missing <main> Landmark',
                description: 'Page lacks a <main> element to identify the main content area.',
                location: 'body',
                suggestion: 'Wrap the main content area in a <main> element.',
                codeSnippet: {
                    before: '<body>\n  <div id="content">...</div>\n</body>',
                    after: '<body>\n  <main>\n    <div id="content">...</div>\n  </main>\n</body>'
                },
                resources: ['https://www.w3.org/WAI/tutorials/page-structure/regions/']
            });
        }

        // Check for div/span soup with click handlers
        const clickableDivs = this.document.querySelectorAll('div[onclick], span[onclick]');
        if (clickableDivs.length > 0) {
            issues.push({
                id: crypto.randomUUID(),
                type: IssueType.Accessibility,
                severity: Severity.High,
                title: 'Non-Semantic Clickable Elements',
                description: `Found ${clickableDivs.length} div/span elements with onclick handlers. These should be buttons.`,
                location: 'body',
                suggestion: 'Use <button> elements for clickable items instead of div/span with onclick.',
                codeSnippet: {
                    before: '<div onclick="handleClick()">Click me</div>',
                    after: '<button type="button" onclick="handleClick()">Click me</button>'
                },
                resources: ['https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html']
            });
        }

        return issues;
    }

    private hasAssociatedLabel(input: Element): boolean {
        const id = input.getAttribute('id');
        if (id) {
            const label = this.document.querySelector(`label[for="${id}"]`);
            if (label) return true;
        }

        // Check if input is inside a label
        let parent = input.parentElement;
        while (parent) {
            if (parent.tagName === 'LABEL') return true;
            parent = parent.parentElement;
        }

        return false;
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
