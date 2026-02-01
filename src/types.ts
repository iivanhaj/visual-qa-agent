// Core type definitions for Visual QA Agent

export enum Severity {
  Critical = 'critical',
  High = 'high',
  Medium = 'medium',
  Low = 'low',
  Info = 'info'
}

export enum IssueType {
  Functionality = 'functionality',
  Accessibility = 'accessibility',
  Performance = 'performance',
  SEO = 'seo',
  Security = 'security',
  BestPractice = 'best-practice',
  Visual = 'visual',
  UX = 'ux'
}


export enum TestType {
  Links = 'links',
  Buttons = 'buttons',
  Forms = 'forms',
  Responsive = 'responsive',
  SEO = 'seo',
  Accessibility = 'accessibility',
  Performance = 'performance',
  Console = 'console',
  Images = 'images',
  Security = 'security'
}

export interface Issue {
  id: string;
  type: IssueType;
  severity: Severity;
  title: string;
  description: string;
  location: string; // CSS selector or file path
  element?: string; // HTML snippet of problematic element
  suggestion: string;
  codeSnippet?: {
    before: string;
    after: string;
  };
  resources?: string[]; // Links to relevant docs/guidelines
}

export interface TestResult {
  testType: TestType;
  passed: boolean;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  issues: Issue[];
  duration: number; // in milliseconds
  timestamp: Date;
}

export interface HealthScore {
  overall: number; // 0-100
  functionality: number;
  accessibility: number;
  performance: number;
  seo: number;
  security: number;
}

export interface BugReport {
  url: string;
  timestamp: Date;
  healthScore: HealthScore;
  testResults: TestResult[];
  allIssues: Issue[];
  summary: {
    totalIssues: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    infoCount: number;
  };
  executiveSummary?: string;
}

export interface ScanHistory {
  id: string;
  url: string;
  timestamp: Date;
  healthScore: number;
  totalIssues: number;
  report: BugReport;
}

export interface ReportConfig {
  format: 'markdown' | 'json' | 'pdf';
  includeScreenshots: boolean;
  includeCodeSnippets: boolean;
  severityFilter?: Severity[];
  issueTypeFilter?: IssueType[];
}

// Message types for Chrome extension communication
export interface StartBugDetectionMessage {
  type: 'RUN_BUG_DETECTION';
  tests: TestType[];
}

export interface TestProgressMessage {
  type: 'TEST_PROGRESS';
  testType: TestType;
  progress: number; // 0-100
  message: string;
}

export interface TestCompleteMessage {
  type: 'TEST_COMPLETE';
  result: TestResult;
}

export interface GenerateReportMessage {
  type: 'GENERATE_REPORT';
  config: ReportConfig;
}
