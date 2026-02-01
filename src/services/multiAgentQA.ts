/**
 * Multi-Agent QA Service
 * Orchestrates all specialized agents for comprehensive webpage analysis
 */
import {
    MessageBus,
    CoordinatorAgent,
    DiscoveryAgent,
    AccessibilityAgent,
    PerformanceAgent,
    SecurityAgent,
    UXAgent,
    type AgentFindings,
    type PageContext
} from './agents';
import { BugReport } from '../types';

export interface MultiAgentReport {
    executiveSummary: string;
    agentFindings: AgentFindings[];
    synthesizedReport: {
        summary: {
            totalIssues: number;
            critical: number;
            high: number;
            medium: number;
            low: number;
            agentStats: Array<{
                agent: string;
                emoji?: string;
                issuesFound: number;
                confidence: number;
                analysisTime: number;
            }>;
        };
        prioritizedIssues: any[];
        agentFindings: AgentFindings[];
    };
    totalAnalysisTime: number;
}

export class MultiAgentQAService {
    private messageBus: MessageBus;
    private coordinator: CoordinatorAgent;
    private agents: any[];
    private progressCallbacks: Array<(message: string, progress: number, agentId: string) => void> = [];

    constructor() {
        // Create message bus
        this.messageBus = new MessageBus();

        // Initialize specialized agents
        this.agents = [
            new DiscoveryAgent(this.messageBus),
            new AccessibilityAgent(this.messageBus),
            new PerformanceAgent(this.messageBus),
            new SecurityAgent(this.messageBus),
            new UXAgent(this.messageBus)
        ];

        // Create coordinator
        this.coordinator = new CoordinatorAgent(this.messageBus, this.agents);

        // Subscribe to progress updates
        this.messageBus.subscribe((message) => {
            if (message.type === 'PROGRESS_UPDATE') {
                this.progressCallbacks.forEach(callback => {
                    callback(
                        message.payload.message,
                        message.payload.progress,
                        message.agentId
                    );
                });
            }
        });
    }

    /**
     * Subscribe to real-time progress updates
     */
    onProgress(callback: (message: string, progress: number, agentId: string) => void) {
        this.progressCallbacks.push(callback);
    }

    /**
     * Run comprehensive multi-agent analysis
     */
    async runAnalysis(screenshots?: string[]): Promise<MultiAgentReport> {
        console.log('🚀 [MultiAgentQA] Starting comprehensive analysis with', this.agents.length, 'agents');
        const startTime = Date.now();

        // Build page context
        const context: PageContext = {
            url: window.location.href,
            title: document.title,
            dom: document,
            screenshots: screenshots,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };

        // Run coordinator orchestration
        const result = await this.coordinator.orchestrate(context);

        const totalTime = Date.now() - startTime;
        console.log(`✅ [MultiAgentQA] Analysis complete in ${totalTime}ms`);

        return {
            ...result,
            totalAnalysisTime: totalTime
        };
    }

    /**
     * Convert multi-agent findings to legacy BugReport format
     * (for backward compatibility with existing UI)
     */
    convertToBugReport(multiAgentReport: MultiAgentReport): BugReport {
        const allIssues = multiAgentReport.synthesizedReport.prioritizedIssues.map((issue, index) => ({
            id: `issue-${index}`,
            ...issue
        }));

        const criticalCount = allIssues.filter(i => i.severity === 'critical').length;
        const highCount = allIssues.filter(i => i.severity === 'high').length;
        const mediumCount = allIssues.filter(i => i.severity === 'medium').length;
        const lowCount = allIssues.filter(i => i.severity === 'low').length;

        // Calculate health scores
        const totalIssues = allIssues.length;
        const weightedScore = 100 - (criticalCount * 15 + highCount * 10 + mediumCount * 5 + lowCount * 2);
        const overall = Math.max(0, Math.min(100, weightedScore));

        // Calculate category scores based on agent findings
        const accessibilityFindings = multiAgentReport.agentFindings.find(f => f.agentId === 'accessibility');
        const performanceFindings = multiAgentReport.agentFindings.find(f => f.agentId === 'performance');
        const securityFindings = multiAgentReport.agentFindings.find(f => f.agentId === 'security');

        return {
            url: window.location.href,
            timestamp: new Date(),
            healthScore: {
                overall: Math.round(overall),
                functionality: 85, // Default for now
                accessibility: accessibilityFindings ? Math.max(0, 100 - accessibilityFindings.issues.length * 10) : 100,
                performance: performanceFindings ? Math.max(0, 100 - performanceFindings.issues.length * 10) : 100,
                seo: 85, // Default for now
                security: securityFindings ? Math.max(0, 100 - securityFindings.issues.length * 15) : 100
            },
            testResults: [],
            allIssues: allIssues,
            summary: {
                totalIssues,
                criticalCount,
                highCount,
                mediumCount,
                lowCount,
                infoCount: 0
            }
        };
    }

    /**
     * Get list of all agents
     */
    getAgents() {
        return this.agents.map(agent => ({
            id: agent.id,
            name: agent.name,
            emoji: agent.emoji
        }));
    }

    /**
     * Clear all subscriptions
     */
    dispose() {
        this.messageBus.clear();
        this.progressCallbacks = [];
    }
}
