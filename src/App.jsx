import { useState, useEffect } from 'react';
import { Settings, Scan, ArrowLeft, Key, AlertTriangle, CheckCircle, Info, Bug, Loader2 } from 'lucide-react';
import { captureTab } from './lib/dom-utils';
import { analyzeScreenshot } from './lib/openai';
import './App.css';

function App() {
  const [view, setView] = useState('HOME'); // HOME, SETTINGS, RESULTS
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (chrome?.storage?.local) {
      chrome.storage.local.get(['openaiApiKey'], (result) => {
        if (result.openaiApiKey) setApiKey(result.openaiApiKey);
      });
    }
  }, []);

  const saveApiKey = (key) => {
    setApiKey(key);
    if (chrome?.storage?.local) {
      chrome.storage.local.set({ openaiApiKey: key });
    }
    setView('HOME');
  };

  const startScan = async () => {
    if (!apiKey) {
      setView('SETTINGS');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // 1. Capture
      console.log("Capturing...");
      const { image, context } = await captureTab();

      // 2. Analyze
      console.log("Analyzing...");
      const analysis = await analyzeScreenshot(apiKey, image, context);

      setResults(analysis);
      setView('RESULTS');
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred during scan.");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="icon-critical" size={16} />;
      case 'warning': return <Bug className="icon-warning" size={16} />;
      default: return <Info className="icon-info" size={16} />;
    }
  };

  const getSeverityClass = (severity) => `issue-card issue-${severity}`;

  if (view === 'SETTINGS') {
    return (
      <div className="container">
        <header className="header">
          <button className="icon-btn" onClick={() => setView('HOME')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Settings</h1>
        </header>
        <main className="main-content">
          <div className="input-group">
            <label>OpenAI API Key</label>
            <div className="input-wrapper">
              <Key size={16} className="input-icon" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
            </div>
            <p className="hint">Your key is stored locally.</p>
          </div>
          <button className="btn-primary" onClick={() => saveApiKey(apiKey)}>
            Save Key
          </button>
        </main>
      </div>
    );
  }

  if (view === 'RESULTS') {
    return (
      <div className="container">
        <header className="header">
          <button className="icon-btn" onClick={() => setView('HOME')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Scan Results</h1>
        </header>
        <main className="main-content">
          <div className="results-summary">
            <div className="score-card">
              <span className="label">Issues Found</span>
              <span className="value">{results?.issues?.length || 0}</span>
            </div>
          </div>

          <div className="issues-list">
            {results?.issues?.map((issue, idx) => (
              <div key={issue.id || idx} className={getSeverityClass(issue.severity)}>
                <div className="issue-header">
                  {getSeverityIcon(issue.severity)}
                  <span className="issue-title">{issue.title}</span>
                </div>
                <p className="issue-desc">{issue.description}</p>
                {issue.suggestion && (
                  <div className="issue-suggestion">
                    <strong>Fix:</strong> {issue.suggestion}
                  </div>
                )}
              </div>
            ))}

            {(!results?.issues || results.issues.length === 0) && (
              <div className="empty-state">
                <CheckCircle size={48} className="text-success" />
                <p>No issues found! Great job.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <Scan size={20} className="brand-icon" />
          <h1>Visual QA</h1>
        </div>
        <button className="icon-btn" onClick={() => setView('SETTINGS')}>
          <Settings size={20} />
        </button>
      </header>

      <main className="main-content home-view">
        <div className="hero">
          <div className="scan-animation-wrapper">
            <Scan size={64} className={`hero-icon ${loading ? 'pulse' : ''}`} />
          </div>
          <h2>Autonomous Quality Assurance</h2>
          <p>Scan the current tab for visual bugs, accessibility issues, and design flaws.</p>
        </div>

        {error && (
          <div className="error-banner">
            <AlertTriangle size={14} />
            <span>{error}</span>
          </div>
        )}

        <button
          className="btn-primary btn-large"
          onClick={startScan}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Analyzing UI...
            </>
          ) : (
            'Start Scan'
          )}
        </button>
      </main>
    </div>
  );
}

export default App;
