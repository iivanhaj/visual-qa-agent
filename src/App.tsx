import { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [apiKey, setApiKey] = useState('');
    const [goal, setGoal] = useState('');
    const [status, setStatus] = useState('Idle');
    const [logs, setLogs] = useState<string[]>([]);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        // Load API Key from storage
        if (chrome?.storage?.local) {
            chrome.storage.local.get(['openai_api_key'], (result) => {
                if (result.openai_api_key) setApiKey(result.openai_api_key);
            });
        }
    }, []);

    const saveApiKey = () => {
        if (chrome?.storage?.local) {
            chrome.storage.local.set({ openai_api_key: apiKey }, () => {
                setLogs(prev => [...prev, 'API Key saved.']);
                setShowSettings(false);
            });
        }
    };

    const startAgent = () => {
        if (!apiKey) {
            setLogs(prev => [...prev, 'Error: API Key missing.']);
            setShowSettings(true);
            return;
        }

        setLogs(prev => [...prev, `Starting agent with goal: ${goal}`]);
        setStatus('Running...');

        // Send message to background script
        chrome.runtime.sendMessage({ type: 'START_AGENT', goal }, (response) => {
            if (chrome.runtime.lastError) {
                setLogs(prev => [...prev, `Error: ${chrome.runtime.lastError.message}`]);
                setStatus('Error');
            } else {
                setLogs(prev => [...prev, 'Agent started via Background successfully.']);
            }
        });
    };

    return (
        <div className="container">
            <header>
                <h1>Visual QA Agent</h1>
                <button className="icon-btn" onClick={() => setShowSettings(!showSettings)}>
                    ⚙️
                </button>
            </header>

            {showSettings ? (
                <div className="settings-panel">
                    <h3>Settings</h3>
                    <div className="input-group">
                        <label>OpenAI API Key</label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-..."
                        />
                    </div>
                    <button onClick={saveApiKey}>Save</button>
                </div>
            ) : (
                <div className="main-panel">
                    <div className="input-group">
                        <label>Why are you here? (Goal)</label>
                        <textarea
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="e.g. Find the login button and click it to verify error handling."
                            rows={4}
                        />
                    </div>

                    <button className="primary-btn" onClick={startAgent} disabled={!goal || status === 'Running...'}>
                        {status === 'Running...' ? 'Agent Running...' : 'Start Agent'}
                    </button>

                    <div className="status-area">
                        <h4>Status: <span className={status.toLowerCase()}>{status}</span></h4>
                        <div className="logs">
                            {logs.map((log, i) => <div key={i}>{log}</div>)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
