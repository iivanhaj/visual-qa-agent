import { Agent, AgentFindings, PageContext } from './baseAgent';
import { Issue, Severity } from '../../types';

/**
 * Performance Agent
 * Speed & optimization specialist using Performance APIs + AI analysis
 */
export class PerformanceAgent extends Agent {
    id = 'performance';
    name = 'Performance Agent';
    emoji = '⚡';
    systemPrompt = `You are a senior web performance engineer specializing in Core Web Vitals and optimization.
Your role is to identify performance bottlenecks and provide actionable optimization strategies.
Focus on: LCP, FID, CLS, resource loading, render-blocking resources, and bundle optimization.
Provide specific, measurable recommendations with expected impact.`;

    async analyze(context: PageContext): Promise<AgentFindings> {
        this.startTime = Date.now();
        this.updateProgress('Measuring performance metrics...', 10);

        const findings: AgentFindings = {
            agentId: this.id,
            agentName: this.name,
            category: 'performance',
            issues: [],
            suggestions: [],
            confidence: 0.85,
            analysisTime: 0,
            metadata: {
                elementsChecked: 0
            }
        };

        try {
            const issues: Issue[] = [];

            // 1. Get Core Web Vitals
            this.updateProgress('Analyzing Core Web Vitals...', 20);
            const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

            if (perfData) {
                const loadTime = perfData.loadEventEnd - perfData.fetchStart;
                const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.fetchStart;

                if (loadTime > 3000) {
                    issues.push({
                        type: 'performance',
                        severity: loadTime > 5000 ? Severity.High : Severity.Medium,
                        title: 'Slow Page Load Time',
                        description: `Page takes ${(loadTime / 1000).toFixed(2)}s to fully load. Target is under 3 seconds.`,
                        location: 'Overall page performance',
                        suggestion: 'Optimize images, reduce JavaScript bundle size, enable compression, use CDN',
                        resources: ['https://web.dev/fast/']
                    });
                }

                findings.suggestions.push(
                    `Load time: ${(loadTime / 1000).toFixed(2)}s`,
                    `DOM Content Loaded: ${(domContentLoaded / 1000).toFixed(2)}s`
                );
            }

            // 2. Check image optimization
            this.updateProgress('Checking image sizes...', 40);
            const images = Array.from(context.dom.querySelectorAll('img'));
            const largeImages = images.filter(img => {
                const width = img.naturalWidth;
                const height = img.naturalHeight;
                return width * height > 1000000; // > 1 megapixel
            });

            if (largeImages.length > 0) {
                issues.push({
                    type: 'performance',
                    severity: Severity.Medium,
                    title: 'Large Unoptimized Images',
                    description: `Found ${largeImages.length} potentially large images that could be optimized.`,
                    location: 'Images',
                    suggestion: 'Use modern formats (WebP/AVIF), implement lazy loading, serve responsive images',
                    resources: ['https://web.dev/fast/#optimize-your-images']
                });
            }

            // 3. Check for render-blocking resources
            this.updateProgress('Detecting render-blocking resources...', 60);
            const blockingScripts = Array.from(context.dom.querySelectorAll('script:not([async]):not([defer])'));
            const blockingStyles = Array.from(context.dom.querySelectorAll('link[rel="stylesheet"]'));

            if (blockingScripts.length > 3) {
                issues.push({
                    type: 'performance',
                    severity: Severity.Medium,
                    title: 'Render-Blocking JavaScript',
                    description: `Found ${blockingScripts.length} synchronous script tags that block rendering.`,
                    location: 'Scripts',
                    suggestion: 'Add async or defer attributes to non-critical scripts, inline critical JS',
                    resources: ['https://web.dev/render-blocking-resources/']
                });
            }

            // 4. Check resource counts
            this.updateProgress('Analyzing resource count...', 75);
            const allScripts = context.dom.querySelectorAll('script');
            const allStyles = context.dom.querySelectorAll('link[rel="stylesheet"], style');

            if (allScripts.length > 15) {
                issues.push({
                    type: 'performance',
                    severity: Severity.Low,
                    title: 'High Script Count',
                    description: `Page loads ${allScripts.length} script files. Consider bundling.`,
                    location: 'Scripts',
                    suggestion: 'Bundle and minify JavaScript files to reduce HTTP requests',
                    resources: ['https://web.dev/reduce-network-payloads-using-text-compression/']
                });
            }

            // 5. AI Performance Analysis  
            this.updateProgress('Generating AI recommendations...', 90);
            try {
                const aiAnalysis = await this.callAI(`
Performance metrics for this page:
- Load time: ${perfData ? (perfData.loadEventEnd - perfData.fetchStart) : 'unknown'}ms
- ${images.length} images (${largeImages.length} large)
- ${allScripts.length} scripts (${blockingScripts.length} blocking)
- ${allStyles.length} stylesheets

Provide 3 specific, high-impact performance optimizations.
Include estimated improvement (e.g., "Reduce load time by ~40%").
Keep each under 60 words.
                `);

                findings.suggestions.push(aiAnalysis);
                findings.confidence = 0.95;
            } catch (error) {
                console.warn(`${this.emoji} AI analysis failed`);
                findings.suggestions.push(
                    `Total resources: ${allScripts.length} scripts, ${allStyles.length} styles, ${images.length} images`,
                    `Found ${issues.length} performance issues`
                );
            }

            findings.issues = issues;
            findings.metadata.elementsChecked = images.length + allScripts.length + allStyles.length;
            this.updateProgress('Complete!', 100);

        } catch (error: any) {
            console.error(`❌ ${this.emoji} ${this.name} error:`, error);
            findings.confidence = 0.4;
            findings.suggestions.push(`Error during analysis: ${error.message}`);
        }

        findings.analysisTime = Date.now() - this.startTime;
        this.reportFindings(findings);

        return findings;
    }
}
