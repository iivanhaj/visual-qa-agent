import { Agent, AgentFindings, PageContext } from './baseAgent';

/**
 * Discovery Agent
 * Maps webpage structure, finds all interactive elements
 * NO AI needed - pure DOM analysis
 */
export class DiscoveryAgent extends Agent {
    id = 'discovery';
    name = 'Discovery Agent';
    emoji = '🔍';
    systemPrompt = `You are a web structure analysis expert. You map webpage layouts and identify user interaction patterns.`;

    async analyze(context: PageContext): Promise<AgentFindings> {
        this.startTime = Date.now();
        this.updateProgress('Mapping page structure...', 10);

        const findings: AgentFindings = {
            agentId: this.id,
            agentName: this.name,
            category: 'structure',
            issues: [],
            suggestions: [],
            confidence: 1.0,
            analysisTime: 0,
            metadata: {
                pagesAnalyzed: 1,
                elementsChecked: 0
            }
        };

        try {
            // 1. Find all links
            const links = Array.from(context.dom.querySelectorAll('a[href]'));
            const externalLinks = links.filter(link => {
                const href = (link as HTMLAnchorElement).href;
                return href.startsWith('http') && !href.includes(window.location.hostname);
            });

            this.updateProgress('Analyzing links...', 30);

            // 2. Find all interactive elements
            const buttons = context.dom.querySelectorAll('button, [role="button"]');
            const inputs = context.dom.querySelectorAll('input, textarea, select');
            const forms = context.dom.querySelectorAll('form');

            this.updateProgress('Finding interactive elements...', 60);

            // 3. Find dynamic content areas
            const iframes = context.dom.querySelectorAll('iframe');
            const videos = context.dom.querySelectorAll('video');
            const canvases = context.dom.querySelectorAll('canvas');

            this.updateProgress('Analyzing dynamic content...', 80);

            // 4. Analyze navigation structure
            const nav = context.dom.querySelector('nav');
            const header = context.dom.querySelector('header');
            const footer = context.dom.querySelector('footer');
            const main = context.dom.querySelector('main');

            const structureIssues = [];
            if (!main) {
                structureIssues.push({
                    title: 'Missing <main> landmark',
                    description: 'No <main> element found. This hurts accessibility and SEO.',
                    severity: 'medium',
                    location: 'document',
                    suggestion: 'Wrap main content in <main> element'
                });
            }

            if (!nav) {
                structureIssues.push({
                    title: 'Missing <nav> landmark',
                    description: 'No <nav> element found for navigation.',
                    severity: 'low',
                    location: 'document',
                    suggestion: 'Use <nav> for primary navigation'
                });
            }

            findings.issues = structureIssues;
            findings.suggestions = [
                `Found ${links.length} links (${externalLinks.length} external)`,
                `${buttons.length} interactive buttons`,
                `${inputs.length} form controls across ${forms.length} forms`,
                iframes.length > 0 ? `Embedded content: ${iframes.length} iframes` : '',
                videos.length > 0 ? `${videos.length} video elements` : ''
            ].filter(Boolean);

            findings.metadata.elementsChecked = links.length + buttons.length + inputs.length;

            this.updateProgress('Complete!', 100);

        } catch (error: any) {
            console.error(`❌ ${this.emoji} ${this.name} error:`, error);
            findings.confidence = 0.5;
            findings.suggestions.push(`Error during analysis: ${error.message}`);
        }

        findings.analysisTime = Date.now() - this.startTime;
        this.reportFindings(findings);

        return findings;
    }
}
