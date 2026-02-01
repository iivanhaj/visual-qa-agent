import OpenAI from 'openai';
import { Issue, BugReport } from '../types';

/**
 * AI-Powered Suggestions using OpenAI
 * Generates intelligent fix recommendations and explanations
 */
export class AISuggestionService {
    private apiKey: string | null = null;

    async initialize(): Promise<void> {
        const result = await chrome.storage.local.get(['openai_api_key']);
        this.apiKey = result.openai_api_key;
    }

    /**
     * Enhance a single issue with AI-generated suggestions
     */
    async enhanceIssue(issue: Issue, pageContext: { url: string; title: string }): Promise<Issue> {
        if (!this.apiKey) {
            return issue; // Return original if no API key
        }

        try {
            const client = new OpenAI({
                apiKey: this.apiKey,
                dangerouslyAllowBrowser: true
            });

            const prompt = `You are a web development expert. A bug was detected on a webpage.

Page: ${pageContext.title} (${pageContext.url})

Issue Type: ${issue.type}
Severity: ${issue.severity}
Problem: ${issue.description}
Location: ${issue.location}

Provide:
1. A clear explanation of WHY this is problematic (2-3 sentences)
2. The business/UX impact
3. A specific, actionable fix (step-by-step)

Be concise and practical.`;

            const completion = await client.chat.completions.create({
                model: "gpt-5-mini",
                messages: [
                    { role: "system", content: "You are an expert web developer helping to fix bugs. Provide clear, actionable advice." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 300,
                temperature: 0.7
            });

            const aiSuggestion = completion.choices[0].message.content || '';

            // Enhance the issue with AI suggestions
            return {
                ...issue,
                suggestion: aiSuggestion,
                resources: [
                    ...(issue.resources || []),
                    '✨ Enhanced with AI suggestions'
                ]
            };
        } catch (error) {
            console.error('AI enhancement failed:', error);
            return issue; // Return original on error
        }
    }

    /**
     * Generate AI-powered executive summary for the entire report
     */
    async generateExecutiveSummary(report: BugReport): Promise<string> {
        if (!this.apiKey) {
            return this.getBasicSummary(report);
        }

        try {
            const client = new OpenAI({
                apiKey: this.apiKey,
                dangerouslyAllowBrowser: true
            });

            const criticalIssues = report.allIssues.filter(i => i.severity === 'critical');
            const highIssues = report.allIssues.filter(i => i.severity === 'high');

            const prompt = `Analyze this webpage quality report and provide an executive summary:

URL: ${report.url}
Overall Health Score: ${report.healthScore.overall}/100

Key Metrics:
- Functionality: ${report.healthScore.functionality}/100
- Accessibility: ${report.healthScore.accessibility}/100
- Performance: ${report.healthScore.performance}/100
- SEO: ${report.healthScore.seo}/100
- Security: ${report.healthScore.security}/100

Total Issues: ${report.summary.totalIssues}
- Critical: ${report.summary.criticalCount}
- High: ${report.summary.highCount}
- Medium: ${report.summary.mediumCount}

Top Issues:
${criticalIssues.slice(0, 3).map(i => `- ${i.title}: ${i.description}`).join('\n')}
${highIssues.slice(0, 2).map(i => `- ${i.title}: ${i.description}`).join('\n')}

Provide:
1. Overall assessment (1 paragraph)
2. Top 3 priorities to fix
3. Estimated impact if fixed

Be professional and concise.`;

            const completion = await client.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a web quality consultant providing executive summaries." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 400,
                temperature: 0.7
            });

            return completion.choices[0].message.content || this.getBasicSummary(report);
        } catch (error) {
            console.error('AI summary generation failed:', error);
            return this.getBasicSummary(report);
        }
    }

    /**
     * Batch enhance multiple critical/high issues with AI
     */
    async enhanceCriticalIssues(issues: Issue[], pageContext: { url: string; title: string }): Promise<Issue[]> {
        if (!this.apiKey || issues.length === 0) {
            return issues;
        }

        // Only enhance critical and high severity issues to save API costs
        const criticalAndHigh = issues.filter(i =>
            i.severity === 'critical' || i.severity === 'high'
        );

        if (criticalAndHigh.length === 0) {
            return issues;
        }

        try {
            const client = new OpenAI({
                apiKey: this.apiKey,
                dangerouslyAllowBrowser: true
            });

            // Batch process up to 5 issues at once
            const issuesToEnhance = criticalAndHigh.slice(0, 5);

            const issuesDescription = issuesToEnhance.map((issue, idx) =>
                `Issue ${idx + 1}: ${issue.title}
Type: ${issue.type}
Severity: ${issue.severity}
Description: ${issue.description}
Location: ${issue.location}`
            ).join('\n\n');

            const prompt = `You are a web development expert. Multiple bugs were detected on a webpage.

Page: ${pageContext.title} (${pageContext.url})

${issuesDescription}

For each issue, provide a concise fix suggestion (2-3 sentences each). Format as:

Issue 1: [fix suggestion]
Issue 2: [fix suggestion]
...`;

            const completion = await client.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are an expert web developer. Provide concise, actionable fixes." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 500,
                temperature: 0.7
            });

            const aiResponse = completion.choices[0].message.content || '';
            const suggestions = aiResponse.split(/Issue \d+:/g).slice(1);

            // Apply AI suggestions to issues
            const enhancedIssues = issuesToEnhance.map((issue, idx) => ({
                ...issue,
                suggestion: suggestions[idx]?.trim() || issue.suggestion,
                resources: [
                    ...(issue.resources || []),
                    '✨ AI-Enhanced Fix'
                ]
            }));

            // Merge enhanced issues back with original list
            const issueMap = new Map(enhancedIssues.map(i => [i.id, i]));
            return issues.map(i => issueMap.get(i.id) || i);

        } catch (error) {
            console.error('Batch AI enhancement failed:', error);
            return issues;
        }
    }

    private getBasicSummary(report: BugReport): string {
        const score = report.healthScore.overall;
        let assessment = '';

        if (score >= 80) {
            assessment = 'Excellent! Your page is in great shape with minimal issues.';
        } else if (score >= 60) {
            assessment = 'Good foundation, but several areas need attention.';
        } else if (score >= 40) {
            assessment = 'Significant issues detected. Prioritize critical and high severity fixes.';
        } else {
            assessment = 'Critical attention required. Multiple serious issues affecting quality.';
        }

        return `${assessment}\n\nTotal Issues: ${report.summary.totalIssues} (${report.summary.criticalCount} critical, ${report.summary.highCount} high priority)`;
    }
}
