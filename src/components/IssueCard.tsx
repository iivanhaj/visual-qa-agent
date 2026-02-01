import React, { useState } from 'react';
import { Issue, Severity } from '../types';
import '../App.css';

interface IssueCardProps {
    issue: Issue;
    index: number;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getSeverityIcon = (severity: Severity) => {
        switch (severity) {
            case Severity.Critical:
                return '🚨';
            case Severity.High:
                return '⚠️';
            case Severity.Medium:
                return '⚡';
            case Severity.Low:
                return 'ℹ️';
            default:
                return '📝';
        }
    };

    return (
        <div className={`issue-card severity-${issue.severity}`}>
            <div className="issue-header" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="issue-title-section">
                    <span className="issue-icon">{getSeverityIcon(issue.severity)}</span>
                    <span className="issue-number">#{index + 1}</span>
                    <h4 className="issue-title">{issue.title}</h4>
                </div>
                <div className="issue-meta">
                    <span className={`severity-badge ${issue.severity}`}>
                        {issue.severity.toUpperCase()}
                    </span>
                    <span className="type-badge">{issue.type}</span>
                    <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
                </div>
            </div>

            {isExpanded && (
                <div className="issue-body">
                    <div className="issue-description">
                        <strong>Description:</strong>
                        <p>{issue.description}</p>
                    </div>

                    <div className="issue-location">
                        <strong>Location:</strong>
                        <code>{issue.location}</code>
                    </div>

                    {issue.element && (
                        <details className="issue-element">
                            <summary>View Element Code</summary>
                            <pre><code>{issue.element}</code></pre>
                        </details>
                    )}

                    <div className="issue-suggestion">
                        <strong>💡 How to Fix:</strong>
                        <p>{issue.suggestion}</p>
                    </div>

                    {issue.codeSnippet && (
                        <div className="code-comparison">
                            <div className="code-before">
                                <strong>❌ Before:</strong>
                                <pre><code>{issue.codeSnippet.before}</code></pre>
                            </div>
                            <div className="code-after">
                                <strong>✅ After:</strong>
                                <pre><code>{issue.codeSnippet.after}</code></pre>
                            </div>
                        </div>
                    )}

                    {issue.resources && issue.resources.length > 0 && (
                        <div className="issue-resources">
                            <strong>📚 Learn More:</strong>
                            <ul>
                                {issue.resources.map((resource, idx) => (
                                    <li key={idx}>
                                        <a href={resource} target="_blank" rel="noopener noreferrer">
                                            {resource}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
