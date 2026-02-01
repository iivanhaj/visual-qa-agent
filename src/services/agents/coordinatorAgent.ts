import { Agent, AgentFindings, MessageBus, PageContext } from './baseAgent';
import { DiscoveryAgent } from './discoveryAgent';

/**
 * Coordinator Agent
 * Orchestrates all specialized agents and synthesizes findings
 */
export class CoordinatorAgent extends Agent {
    id = 'coordinator';
    name = 'Coordinator';
    emoji = '🎯';
    systemPrompt = `You are the coordinator of a multi-agent QA testing system. Your job is to:
1. Synthesize findings from multiple specialized agents
2. Identify duplicate issues across agents
3. Prioritize issues by severity and business impact
4. Generate an executive summary for stakeholders
5. Create an actionable remediation plan

Be concise, clear, and actionable.`;

    private agents: Agent[] = [];
    private allFindings: AgentFindings[] = [];

    constructor(messageBus: MessageBus, agents: Agent[]) {
        super(messageBus);
        this.agents = agents;
    }

    /**
     * Orchestrate all agents in parallel
     */
    async orchestrate(context: PageContext): Promise<{
        executiveSummary: string;
        allFindings: AgentFindings[];
        synthesizedReport: any;
    }> {
        console.log(`${this.emoji} [${this.name}] Orchestrating ${this.agents.length} agents...`);
        this.updateProgress('Spawning specialized agents...', 5);

        try {
            // 1. Run all agents in parallel
            const startTime = Date.now();
            const agentPromises = this.agents.map(async (agent, index) => {
                const progress = 10 + (index / this.agents.length) * 60;
                this.updateProgress(`Running ${agent.name}...`, progress);

                try {
                    return await agent.analyze(context);
                } catch (error: any) {
                    console.error(`Agent ${agent.id} failed:`, error);
                    return {
                        agentId: agent.id,
                        agentName: agent.name,
                        category: 'error',
                        issues: [],
                        suggestions: [`Agent failed: ${error.message}`],
                        confidence: 0,
                        analysisTime: 0,
                        metadata: {}
                    };
                }
            });

            this.allFindings = await Promise.all(agentPromises);
            const totalTime = Date.now() - startTime;

            console.log(`✅ All agents completed in ${totalTime}ms`);
            this.updateProgress('Synthesizing findings...', 75);

            // 2. Deduplicate and prioritize issues
            const synthesized = this.synthesize(this.allFindings);

            this.updateProgress('Generating executive summary...', 90);

            // 3. Generate AI-powered executive summary
            const executiveSummary = await this.generateExecutiveSummary(synthesized);

            this.updateProgress('Complete!', 100);

            return {
                executiveSummary,
                allFindings: this.allFindings,
                synthesizedReport: synthesized
            };

        } catch (error: any) {
            console.error(`${this.emoji} Orchestration error:`, error);
            throw error;
        }
    }

    /**
     * Required analyze method (not used - we use orchestrate instead)
     */
    async analyze(context: PageContext): Promise<AgentFindings> {
        const result = await this.orchestrate(context);
        return {
            agentId: this.id,
            agentName: this.name,
            category: 'coordination',
            issues: [],
            suggestions: [result.executiveSummary],
            confidence: 1.0,
            analysisTime: 0,
            metadata: {
                pagesAnalyzed: 1
            }
        };
    }

    /**
     * Deduplicate and prioritize issues
     */
    private synthesize(findings: AgentFindings[]): any {
        const allIssues = findings.flatMap(f =>
            f.issues.map(issue => ({
                ...issue,
                source: f.agentName,
                sourceEmoji: this.agents.find(a => a.id === f.agentId)?.emoji || '📋'
            }))
        );

        // Sort by severity
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        allIssues.sort((a, b) => {
            const severityA = severityOrder[a.severity as keyof typeof severityOrder] || 0;
            const severityB = severityOrder[b.severity as keyof typeof severityOrder] || 0;
            return severityB - severityA;
        });

        const stats = {
            totalIssues: allIssues.length,
            critical: allIssues.filter(i => i.severity === 'critical').length,
            high: allIssues.filter(i => i.severity === 'high').length,
            medium: allIssues.filter(i => i.severity === 'medium').length,
            low: allIssues.filter(i => i.severity === 'low').length,
            agentStats: findings.map(f => ({
                agent: f.agentName,
                emoji: this.agents.find(a => a.id === f.agentId)?.emoji,
                issuesFound: f.issues.length,
                confidence: f.confidence,
                analysisTime: f.analysisTime
            }))
        };

        return {
            summary: stats,
            prioritizedIssues: allIssues,
            agentFindings: findings
        };
    }

    /**
     * Generate AI-powered executive summary
     */
    private async generateExecutiveSummary(synthesized: any): Promise<string> {
        try {
            const prompt = `
Generate a concise executive summary for this multi-agent QA test:

**Statistics:**
- Total Issues: ${synthesized.summary.totalIssues}
- Critical: ${synthesized.summary.critical}
- High: ${synthesized.summary.high}
- Medium: ${synthesized.summary.medium}
- Low: ${synthesized.summary.low}

**Agent Performance:**
${synthesized.summary.agentStats.map((a: any) =>
                `- ${a.emoji} ${a.agent}: Found ${a.issuesFound} issues (${a.analysisTime}ms)`
            ).join('\n')}

**Top 5 Issues:**
${synthesized.prioritizedIssues.slice(0, 5).map((issue: any, i: number) =>
                `${i + 1}. [${issue.severity.toUpperCase()}] ${issue.title} (Found by ${issue.sourceEmoji} ${issue.source})`
            ).join('\n')}

Provide:
1. Overall health assessment (1-2 sentences)
2. Top 3 priorities to fix
3. Estimated effort (hours)

Keep it under 200 words.
`;

            const summary = await this.callAI(prompt);
            return summary;

        } catch (error) {
            console.warn('AI summary failed, using fallback');
            return `Multi-agent analysis complete. Found ${synthesized.summary.totalIssues} issues across ${synthesized.summary.agentStats.length} specialized agents.`;
        }
    }
}
