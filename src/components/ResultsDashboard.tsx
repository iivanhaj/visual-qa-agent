import React from 'react';
import { BugReport, Severity } from '../types';
import '../App.css';

interface ResultsDashboardProps {
    report: BugReport | null;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ report }) => {
    if (!report) {
        return (
            <div className="results-dashboard empty">
                <p>Run tests to see results here</p>
            </div>
        );
    }

    return (
        <div className="results-dashboard">
            {/* Health Score Circle */}
            <div className="health-score-container">
                <div className="health-score-circle">
                    <svg viewBox="0 0 100 100" className="progress-ring">
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#2a2a4a"
                            strokeWidth="8"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={getScoreColor(report.healthScore.overall)}
                            strokeWidth="8"
                            strokeDasharray={`${2 * Math.PI * 45}`}
                            strokeDashoffset={`${2 * Math.PI * 45 * (1 - report.healthScore.overall / 100)}`}
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                        />
                    </svg>
                    <div className="score-text">
                        <div className="score-number">{Math.round(report.healthScore.overall)}</div>
                        <div className="score-label">Health Score</div>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="summary-stats">
                <div className="stat-card">
                    <div className="stat-value">{report.summary.totalIssues}</div>
                    <div className="stat-label">Total Issues</div>
                </div>
                <div className={`stat-card severity-${Severity.Critical}`}>
                    <div className="stat-value">{report.summary.criticalCount}</div>
                    <div className="stat-label">Critical</div>
                </div>
                <div className={`stat-card severity-${Severity.High}`}>
                    <div className="stat-value">{report.summary.highCount}</div>
                    <div className="stat-label">High</div>
                </div>
                <div className={`stat-card severity-${Severity.Medium}`}>
                    <div className="stat-value">{report.summary.mediumCount}</div>
                    <div className="stat-label">Medium</div>
                </div>
                <div className={`stat-card severity-${Severity.Low}`}>
                    <div className="stat-value">{report.summary.lowCount}</div>
                    <div className="stat-label">Low</div>
                </div>
            </div>

            {/* Category Scores */}
            <div className="category-scores">
                <h4>Category Breakdown</h4>
                {Object.entries(report.healthScore).map(([key, value]) => {
                    if (key === 'overall') return null;
                    return (
                        <div key={key} className="category-score-item">
                            <div className="category-name">{capitalizeFirst(key)}</div>
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar-fill"
                                    style={{
                                        width: `${value}%`,
                                        background: getScoreGradient(value)
                                    }}
                                />
                            </div>
                            <div className="category-value">{value}/100</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

function getScoreColor(score: number): string {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // orange
    if (score >= 40) return '#ef4444'; // red
    return '#7f1d1d'; // dark red
}

function getScoreGradient(score: number): string {
    if (score >= 80) return 'linear-gradient(90deg, #10b981, #34d399)';
    if (score >= 60) return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
    if (score >= 40) return 'linear-gradient(90deg, #ef4444, #f87171)';
    return 'linear-gradient(90deg, #7f1d1d, #991b1b)';
}

function capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
