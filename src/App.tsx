import { useState, useEffect, useRef } from 'react';
import './App.css';
import { BugReport, TestType } from './types';
import { ResultsDashboard } from './components/ResultsDashboard';
import { IssueCard } from './components/IssueCard';
import { ReportGenerator } from './services/reportGenerator';
import { MultiAgentQAService, type MultiAgentReport } from './services/multiAgentQA';
import type { AgentFindings } from './services/agents';
import ReactMarkdown from 'react-markdown';

type Tab = 'test' | 'results' | 'settings';

function App() {
    const [apiKey, setApiKey] = useState('');
    const [activeTab, setActiveTab] = useState<Tab>('test');
    const [status, setStatus] = useState('Idle');
    const [logs, setLogs] = useState<string[]>(['Extension loaded successfully']);
    const [bugReport, setBugReport] = useState<BugReport | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    // Multi-Agent State
    const [multiAgentMode, setMultiAgentMode] = useState(true); // Default to multi-agent!
    const [multiAgentReport, setMultiAgentReport] = useState<MultiAgentReport | null>(null);
    const [agentProgress, setAgentProgress] = useState<Record<string, { message: string; progress: number }>>({});
    const qaServiceRef = useRef<MultiAgentQAService | null>(null);


    // Test selection checkboxes
    const [selectedTests, setSelectedTests] = useState<TestType[]>([
        TestType.Links,
        TestType.Buttons,
        TestType.SEO,
        TestType.Accessibility,
        TestType.Performance
    ]);

    useEffect(() => {
        console.log('🚀 Visual QA Agent: App Component Mounted');
        setLogs(prev => [...prev, '✅ React app initialized']);

        // Load API Key from storage
        if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
            console.log('📦 Loading API key from storage...');
            chrome.storage.local.get(['openai_api_key'], (result) => {
                if (result.openai_api_key) {
                    setApiKey(result.openai_api_key);
                    console.log('✅ API key loaded');
                    setLogs(prev => [...prev, '✅ API key found']);
                } else {
                    console.log('⚠️ No API key found');
                    setLogs(prev => [...prev, '⚠️ No API key configured']);
                }
            });

            // Listen for test progress updates
            chrome.runtime.onMessage.addListener((message) => {
                console.log('📨 Message received:', message);
                if (message.type === 'TEST_PROGRESS') {
                    setLogs(prev => [...prev, `[${message.progress}%] ${message.message}`]);
                }
            });
        } else {
            console.error('❌ Chrome APIs not available');
            setLogs(prev => [...prev, '❌ Chrome APIs not available']);
        }
    }, []);

    const saveApiKey = () => {
        console.log('💾 Saving API key...');
        if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
            chrome.storage.local.set({ openai_api_key: apiKey }, () => {
                console.log('✅ API key saved');
                setLogs(prev => [...prev, '✅ API Key saved']);
            });
        }
    };

    const toggleTest = (test: TestType) => {
        setSelectedTests(prev =>
            prev.includes(test)
                ? prev.filter(t => t !== test)
                : [...prev, test]
        );
        console.log('🔄 Test selection toggled:', test);
    };

    const runAllTests = () => {
        console.log('⚡ Running all tests...');
        setSelectedTests([
            TestType.Links,
            TestType.Buttons,
            TestType.Forms,
            TestType.Responsive,
            TestType.SEO,
            TestType.Accessibility,
            TestType.Performance,
            TestType.Images,
            TestType.Security
        ]);
        setTimeout(() => runBugDetection(), 100);
    };

    const runBugDetection = async () => {
        if (selectedTests.length === 0) {
            console.error('❌ No tests selected');
            setLogs(prev => [...prev, '❌ Error: Please select at least one test']);
            return;
        }

        console.log(`🔍 Starting bug detection with ${selectedTests.length} tests:`, selectedTests);
        setLogs([`🔍 Starting bug detection with ${selectedTests.length} tests...`]);
        setStatus('Running...');
        setIsRunning(true);

        if (typeof chrome === 'undefined' || !chrome?.runtime) {
            console.error('❌ Chrome runtime not available');
            setLogs(prev => [...prev, '❌ Chrome runtime not available']);
            setStatus('Error');
            setIsRunning(false);
            return;
        }

        console.log('📤 Sending RUN_BUG_DETECTION message to background...');

        // Helper for running legacy scan
        const executeLegacyScan = (tests: TestType[]): Promise<BugReport> => {
            return new Promise((resolve, reject) => {
                chrome.runtime.sendMessage(
                    { type: 'RUN_BUG_DETECTION', tests },
                    (response) => {
                        if (chrome.runtime.lastError) {
                            reject(chrome.runtime.lastError);
                        } else if (response && response.success) {
                            resolve(response.report);
                        } else {
                            reject(new Error(response?.error || 'Unknown error'));
                        }
                    }
                );
            });
        };

        try {
            const report = await executeLegacyScan(selectedTests);
            console.log('✅ Bug detection complete:', report);
            setBugReport(report);
            setLogs(prev => [
                ...prev,
                `✅ Detection complete!`,
                `📊 Found ${report.summary.totalIssues} issues`,
                `⚡ Health Score: ${report.healthScore.overall}/100`
            ]);
            setStatus('Complete');
            setActiveTab('results');
        } catch (error: any) {
            const msg = error.message || String(error);
            console.error('❌ Chrome runtime error:', msg);
            setLogs(prev => [...prev, `❌ Error: ${msg}`]);
            setStatus('Error');
        } finally {
            setIsRunning(false);
        }
    };

    // Comprehensive Scan Function (AI + Legacy)
    const runMultiAgentScan = async () => {
        console.log('🤖 Starting Comprehensive Scan (AI + Legacy)...');
        setLogs(['🚀 Starting Comprehensive Analysis...', '🤖 Initializing specialized AI agents...', '⚡ Preparing legacy test suite...']);
        setStatus('Running Comprehensive Scan...');
        setIsRunning(true);
        setAgentProgress({});
        setMultiAgentReport(null);

        try {
            // Helper for legacy scan (defined here to access scope)
            const executeLegacyScan = (tests: TestType[]): Promise<BugReport> => {
                return new Promise((resolve, reject) => {
                    chrome.runtime.sendMessage(
                        { type: 'RUN_BUG_DETECTION', tests },
                        (response) => {
                            if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
                            else if (response?.success) resolve(response.report);
                            else reject(new Error(response?.error || 'Unknown error'));
                        }
                    );
                });
            };

            // Initialize QA service if not already done
            if (!qaServiceRef.current) {
                qaServiceRef.current = new MultiAgentQAService();
                qaServiceRef.current.onProgress((message, progress, agentId) => {
                    setAgentProgress(prev => ({
                        ...prev,
                        [agentId]: { message, progress }
                    }));
                    const agents = qaServiceRef.current!.getAgents();
                    const agent = agents.find(a => a.id === agentId);
                    setLogs(prev => [...prev, `${agent?.emoji || '🤖'} ${agent?.name || agentId}: ${message}`]);
                });
                setLogs(prev => [...prev, `✅ Initialized ${qaServiceRef.current?.getAgents().length || 0} specialized agents`]);
            }

            // Capture Screenshot
            let screenshots: string[] | undefined;
            if (chrome?.tabs) {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (tab.id) {
                    try {
                        const screenshot = await chrome.tabs.captureVisibleTab({ format: 'png' });
                        screenshots = [screenshot];
                        setLogs(prev => [...prev, '📸 Screenshot captured to enhance AI analysis']);
                    } catch (err) {
                        console.warn('Screenshot capture failed:', err);
                    }
                }
            }

            // PARALLEL EXECUTION: Run AI Agents AND All Legacy Tests
            setLogs(prev => [...prev, '🔄 Running 10 Legacy Tests & 5 AI Agents in parallel...']);

            const [aiReport, legacyReport] = await Promise.all([
                qaServiceRef.current.runAnalysis(screenshots),
                executeLegacyScan(Object.values(TestType) as TestType[])
            ]);

            setMultiAgentReport(aiReport);

            // MERGE REPORTS
            const aiConvertedReport = qaServiceRef.current.convertToBugReport(aiReport);

            // Combine issues
            const combinedIssues = [...legacyReport.allIssues, ...aiConvertedReport.allIssues];

            // Recalculate Stats
            const criticalCount = combinedIssues.filter(i => i.severity === 'critical').length;
            const highCount = combinedIssues.filter(i => i.severity === 'high').length;
            const mediumCount = combinedIssues.filter(i => i.severity === 'medium').length;

            // Calculate combined health score (average of both methods or weighted)
            // Weight AI score slightly higher? Let's average them for balance.
            const overallScore = Math.round((legacyReport.healthScore.overall + aiConvertedReport.healthScore.overall) / 2);

            const mergedReport: BugReport = {
                ...legacyReport,
                url: aiConvertedReport.url || legacyReport.url,
                timestamp: new Date(),
                healthScore: {
                    overall: overallScore,
                    functionality: legacyReport.healthScore.functionality,
                    accessibility: Math.min(legacyReport.healthScore.accessibility, aiConvertedReport.healthScore.accessibility),
                    performance: Math.min(legacyReport.healthScore.performance, aiConvertedReport.healthScore.performance),
                    seo: legacyReport.healthScore.seo,
                    security: Math.min(legacyReport.healthScore.security, aiConvertedReport.healthScore.security)
                },
                allIssues: combinedIssues,
                testResults: legacyReport.testResults, // Keep legacy test results
                summary: {
                    totalIssues: combinedIssues.length,
                    criticalCount,
                    highCount,
                    mediumCount,
                    lowCount: combinedIssues.length - (criticalCount + highCount + mediumCount),
                    infoCount: 0
                }
            };

            // Attach AI executive summary to the merged report object (dynamically, TS ignore if needed or assume safe)
            (mergedReport as any).executiveSummary = aiReport.executiveSummary;

            setBugReport(mergedReport);

            setLogs(prev => [
                ...prev,
                `✅ Comprehensive Scan Complete!`,
                `📊 Total Issues: ${combinedIssues.length} (Legacy: ${legacyReport.allIssues.length}, AI: ${aiConvertedReport.allIssues.length})`,
                `🎯 Global Health Score: ${overallScore}/100`
            ]);

            setStatus('Complete');
            setActiveTab('results');

        } catch (error: any) {
            console.error('❌ Comprehensive scan failed:', error);
            setLogs(prev => [...prev, `❌ Error: ${error.message}`]);
            setStatus('Error');
        } finally {
            setIsRunning(false);
        }
    };


    const downloadReport = async (format: 'markdown' | 'json') => {
        if (!bugReport) return;

        console.log(`📄 Generating ${format} report...`);
        setLogs(prev => [...prev, `📄 Generating ${format.toUpperCase()} report...`]);

        if (apiKey) {
            setLogs(prev => [...prev, '🤖 AI enhancement enabled']);
        }

        const generator = new ReportGenerator();

        try {
            if (format === 'markdown') {
                const markdown = await generator.generateMarkdown(bugReport);
                downloadFile(markdown, `bug-report-${new Date().toISOString().split('T')[0]}.md`, 'text/markdown');
                console.log('✅ Markdown report downloaded');
            } else {
                const json = generator.generateJSON(bugReport);
                downloadFile(json, `bug-report-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
                console.log('✅ JSON report downloaded');
            }

            setLogs(prev => [...prev, `✅ Report downloaded as ${format.toUpperCase()}`]);
        } catch (error: any) {
            console.error('❌ Report generation failed:', error);
            setLogs(prev => [...prev, `❌ Error: ${error.message}`]);
        }
    };

    const downloadFile = (content: string, filename: string, type: string) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };



    console.log('🎨 Rendering App. Active tab:', activeTab, 'Bug report:', !!bugReport);

    return (
        <div className="container">
            <header className="header">
                <div className="header-content">
                    <h1>🔍 Visual QA Agent</h1>
                    <p className="subtitle" style={{ color: '#fbbf24', fontWeight: 500 }}>⚠️ Refresh the page before starting test</p>
                    {!apiKey && (
                        <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>
                            🔑 Please add OpenAI API Key in Settings first
                        </p>
                    )}
                </div>
            </header>

            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'test' ? 'active' : ''}`}
                    onClick={() => {
                        console.log('📑 Switching to Test tab');
                        setActiveTab('test');
                    }}
                >
                    Test
                </button>
                <button
                    className={`tab ${activeTab === 'results' ? 'active' : ''}`}
                    onClick={() => {
                        console.log('📑 Switching to Results tab');
                        setActiveTab('results');
                    }}
                    disabled={!bugReport}
                >
                    Results {bugReport && `(${bugReport.summary.totalIssues})`}
                </button>
                <button
                    className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => {
                        console.log('📑 Switching to Settings tab');
                        setActiveTab('settings');
                    }}
                >
                    Settings
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'test' && (
                    <div className="test-panel">
                        {/* Multi-Agent Section */}
                        <div style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '2px solid rgba(102, 126, 234, 0.3)' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                🤖 Multi-Agent Comprehensive Scan
                                <span style={{ fontSize: '12px', background: 'rgba(102, 126, 234, 0.3)', padding: '4px 8px', borderRadius: '4px' }}>AI-Powered</span>
                            </h3>
                            <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '15px' }}>
                                5 specialized AI agents analyze your page in parallel: Discovery, Accessibility, Performance, Security, UX
                            </p>

                            <button
                                className="primary-btn"
                                onClick={runMultiAgentScan}
                                disabled={isRunning}
                                style={{ width: '100%', marginBottom: '15px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                            >
                                {isRunning ? '🔄 Comprehensive Scan Running...' : '🚀 Run Comprehensive Scan (AI + Legacy)'}
                            </button>

                            {/* Agent Progress */}
                            {Object.keys(agentProgress).length > 0 && (
                                <div style={{ marginTop: '15px' }}>
                                    <h4 style={{ fontSize: '13px', marginBottom: '10px', opacity: 0.9 }}>Agent Progress:</h4>
                                    {Object.entries(agentProgress).map(([agentId, progress]) => {
                                        const agent = qaServiceRef.current?.getAgents()?.find(a => a.id === agentId);
                                        return (
                                            <div key={agentId} style={{ marginBottom: '8px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                                                    <span>{agent?.emoji} {agent?.name || agentId}</span>
                                                    <span>{progress.progress}%</span>
                                                </div>
                                                <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '4px', overflow: 'hidden', height: '6px' }}>
                                                    <div style={{
                                                        width: `${progress.progress}%`,
                                                        height: '100%',
                                                        background: 'linear-gradient(90deg, #667eea, #764ba2)',
                                                        transition: 'width 0.3s ease'
                                                    }} />
                                                </div>
                                                <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>
                                                    {progress.message}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Status Area - Moved Outside Details */}
                        <div className="status-area" style={{ marginBottom: '20px' }}>
                            <div className="status-header">
                                <h4>Status: <span className={status.toLowerCase()}>{status}</span></h4>
                            </div>
                            <div className="logs" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                {logs.map((log, i) => <div key={i} className="log-entry">{log}</div>)}
                            </div>
                        </div>

                        {/* Legacy Test Selection */}
                        <details style={{ marginBottom: '20px' }}>
                            <summary style={{ cursor: 'pointer', padding: '10px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', marginBottom: '10px' }}>
                                <strong>Legacy Mode: </strong>Select Individual Tests
                            </summary>
                            <div>
                                <h3>Select Tests to Run</h3>
                                <div className="test-grid">
                                    {Object.values(TestType).map(test => (
                                        <label key={test} className="test-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={selectedTests.includes(test)}
                                                onChange={() => toggleTest(test)}
                                            />
                                            <span>{getTestLabel(test)}</span>
                                        </label>
                                    ))}
                                </div>

                                <div className="button-group">
                                    <button
                                        className="primary-btn"
                                        onClick={runBugDetection}
                                        disabled={isRunning || selectedTests.length === 0}
                                    >
                                        {isRunning ? '🔄 Running Tests...' : '▶️ Run Selected Tests'}
                                    </button>
                                    <button
                                        className="secondary-btn"
                                        onClick={runAllTests}

                                        disabled={isRunning}
                                    >
                                        ⚡ Quick Scan (All Tests)
                                    </button>
                                </div>
                            </div>
                        </details>
                    </div>
                )}

                {activeTab === 'results' && (
                    <div className="results-panel">
                        {/* AI Executive Summary */}
                        {(multiAgentReport?.executiveSummary || bugReport?.executiveSummary) && (
                            <div className="summary-card" style={{
                                background: 'linear-gradient(to right, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                                padding: '20px',
                                borderRadius: '12px',
                                marginBottom: '24px',
                                border: '1px solid rgba(102, 126, 234, 0.2)'
                            }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 0, marginBottom: '12px', color: '#fff' }}>
                                    🤖 AI Executive Summary
                                </h3>
                                <div className="markdown-content" style={{
                                    lineHeight: '1.6',
                                    fontSize: '14px',
                                    color: 'rgba(255, 255, 255, 0.9)'
                                }}>
                                    <ReactMarkdown>{multiAgentReport?.executiveSummary || bugReport?.executiveSummary || ''}</ReactMarkdown>
                                </div>
                            </div>
                        )}

                        {bugReport ? (
                            <>
                                <ResultsDashboard report={bugReport} />

                                <div className="export-section">
                                    <button onClick={() => downloadReport('markdown')} className="export-btn">
                                        📄 Export as Markdown
                                    </button>
                                    <button onClick={() => downloadReport('json')} className="export-btn">
                                        📊 Export as JSON
                                    </button>
                                </div>

                                <div className="issues-section">
                                    <h3>All Issues ({bugReport.allIssues.length})</h3>
                                    {bugReport.allIssues.length === 0 ? (
                                        <div className="no-issues">
                                            <p>🎉 No issues found! Your page is looking great!</p>
                                        </div>
                                    ) : (
                                        <div className="issues-list">
                                            {bugReport.allIssues.map((issue, index) => (
                                                <IssueCard key={issue.id} issue={issue} index={index} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="empty-results">
                                <p>No results yet. Run some tests to see results here.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="settings-panel">
                        <h3>⚙️ Settings</h3>
                        <div className="input-group">
                            <label>OpenAI API Key</label>
                            <p className="help-text">
                                Required for AI-powered features (issue enhancement & executive summary)
                            </p>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="sk-..."
                            />
                        </div>
                        <button onClick={saveApiKey} className="primary-btn">Save</button>

                        <div className="debug-info">
                            <h4>Debug Info:</h4>
                            <pre>{JSON.stringify({
                                chromeAvailable: typeof chrome !== 'undefined',
                                hasApiKey: !!apiKey,
                                selectedTests: selectedTests.length,
                                hasReport: !!bugReport
                            }, null, 2)}</pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function getTestLabel(test: TestType): string {
    const labels: Record<TestType, string> = {
        [TestType.Links]: '🔗 Links',
        [TestType.Buttons]: '🔘 Buttons',
        [TestType.Forms]: '📝 Forms',
        [TestType.Responsive]: '📱 Responsive',
        [TestType.SEO]: '🔍 SEO',
        [TestType.Accessibility]: '♿ Accessibility',
        [TestType.Performance]: '⚡ Performance',
        [TestType.Console]: '🐛 Console',
        [TestType.Images]: '🖼️ Images',
        [TestType.Security]: '🔒 Security'
    };
    return labels[test] || test;
}

export default App;
