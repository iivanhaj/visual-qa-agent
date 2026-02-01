import { createOpenAIClient } from '../openai';

export interface PageContext {
    url: string;
    title: string;
    dom: Document;
    screenshots?: string[];
    viewport: {
        width: number;
        height: number;
    };
}

export interface AgentMessage {
    agentId: string;
    type: 'TASK_ASSIGNMENT' | 'PROGRESS_UPDATE' | 'FINDINGS' | 'QUESTION' | 'RESPONSE';
    payload: any;
    timestamp: Date;
    correlationId: string;
}

export interface AgentFindings {
    agentId: string;
    agentName: string;
    category: string;
    issues: any[];
    suggestions: string[];
    confidence: number; // 0-1
    analysisTime: number; // ms
    metadata: {
        pagesAnalyzed?: number;
        elementsChecked?: number;
        ai TokensUsed ?: number;
    };
}

/**
 * Base Agent Class
 * All specialized agents extend this
 */
export abstract class Agent {
    abstract id: string;
    abstract name: string;
    abstract emoji: string;
    abstract systemPrompt: string;
    abstract model: string; // Dynamic model selection

    protected messageBus: MessageBus;
    protected startTime: number = 0;

    constructor(messageBus: MessageBus) {
        this.messageBus = messageBus;
    }

    /**
     * Main analysis method - must be implemented by each agent
     */
    abstract analyze(context: PageContext): Promise<AgentFindings>;

    /**
     * Call OpenAI with agent-specific prompts
     */
    protected async callAI(userPrompt: string, useVision: boolean = false, images?: string[]): Promise<string> {
        const client = await createOpenAIClient();

        const messages: any[] = [
            { role: 'system', content: this.systemPrompt }
        ];

        if (useVision && images && images.length > 0) {
            const content: any[] = [
                { type: 'text', text: userPrompt }
            ];

            images.forEach(img => {
                content.push({
                    type: 'image_url',
                    image_url: { url: img }
                });
            });

            messages.push({ role: 'user', content });
        } else {
            messages.push({ role: 'user', content: userPrompt });
        }

        const response = await client.chat.completions.create({
            model: useVision ? 'gpt-5-mini-2025-08-07' : this.model,
            messages: messages,
            max_completion_tokens: 1000,
            temperature: 0.3
        });

        return response.choices[0].message.content || '';
    }

    /**
     * Send progress update
     */
    protected updateProgress(message: string, progress: number) {
        this.messageBus.publish({
            agentId: this.id,
            type: 'PROGRESS_UPDATE',
            payload: { message, progress },
            timestamp: new Date(),
            correlationId: `${this.id}-${Date.now()}`
        });
    }

    /**
     * Send findings
     */
    protected reportFindings(findings: AgentFindings) {
        this.messageBus.publish({
            agentId: this.id,
            type: 'FINDINGS',
            payload: findings,
            timestamp: new Date(),
            correlationId: `${this.id}-${Date.now()}`
        });
    }

    /**
     * Ask another agent a question
     */
    protected async ask(targetAgent: Agent, question: string): Promise<string> {
        const correlationId = `${this.id}-to-${targetAgent.id}-${Date.now()}`;

        this.messageBus.publish({
            agentId: this.id,
            type: 'QUESTION',
            payload: { question, targetAgentId: targetAgent.id },
            timestamp: new Date(),
            correlationId
        });

        // Wait for response (simplified - in real system, use event emitter)
        return new Promise((resolve) => {
            const unsubscribe = this.messageBus.subscribe((msg) => {
                if (msg.correlationId === correlationId && msg.type === 'RESPONSE') {
                    unsubscribe();
                    resolve(msg.payload.answer);
                }
            });
        });
    }
}

/**
 * Message Bus for inter-agent communication
 */
export class MessageBus {
    private subscribers: Array<(message: AgentMessage) => void> = [];

    publish(message: AgentMessage) {
        console.log(`📨 [MessageBus] ${message.agentId} -> ${message.type}`, message.payload);
        this.subscribers.forEach(sub => sub(message));
    }

    subscribe(callback: (message: AgentMessage) => void): () => void {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    clear() {
        this.subscribers = [];
    }
}
