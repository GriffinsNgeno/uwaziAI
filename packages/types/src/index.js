/**
 * Budget Data Types and Constants
 * This file defines the data structures used throughout the transparencyAI platform
 */

// Budget Status Enum
export const BudgetStatus = {
  PLANNED: 'planned',
  APPROVED: 'approved',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Budget Year Status Enum
export const BudgetYearStatus = {
  PLANNING: 'planning',
  ACTIVE: 'active',
  CLOSED: 'closed',
  AUDITED: 'audited'
};

// Analysis Type Enum
export const AnalysisType = {
  TREND_ANALYSIS: 'trend_analysis',
  ANOMALY_DETECTION: 'anomaly_detection',
  COMPARATIVE_ANALYSIS: 'comparative_analysis',
  PREDICTIVE_ANALYSIS: 'predictive_analysis',
  EFFICIENCY_ANALYSIS: 'efficiency_analysis'
};

// Anomaly Type Enum
export const AnomalyType = {
  UNUSUAL_SPENDING: 'unusual_spending',
  BUDGET_OVERRUN: 'budget_overrun',
  UNDERSPENDING: 'underspending',
  SEASONAL_DEVIATION: 'seasonal_deviation',
  DEPARTMENT_COMPARISON: 'department_comparison'
};

// Chart Type Enum
export const ChartType = {
  BAR: 'bar',
  LINE: 'line',
  PIE: 'pie',
  DOUGHNUT: 'doughnut',
  TREEMAP: 'treemap',
  SCATTER: 'scatter',
  AREA: 'area',
  RADAR: 'radar',
  HEATMAP: 'heatmap',
  SANKEY: 'sankey'
};

// Filter Type Enum
export const FilterType = {
  DATE_RANGE: 'date_range',
  DEPARTMENT: 'department',
  CATEGORY: 'category',
  AMOUNT_RANGE: 'amount_range',
  STATUS: 'status',
  LOCATION: 'location'
};

// User Role Enum
export const UserRole = {
  VIEWER: 'viewer',
  ANALYST: 'analyst',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

// Export Type Enum
export const ExportType = {
  DASHBOARD: 'dashboard',
  CHART: 'chart',
  BUDGET_DATA: 'budget_data',
  ANALYSIS_REPORT: 'analysis_report'
};

// Export Format Enum
export const ExportFormat = {
  PDF: 'pdf',
  PNG: 'png',
  CSV: 'csv',
  EXCEL: 'excel',
  JSON: 'json'
};

// Export Status Enum
export const ExportStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// Import Status Enum
export const ImportStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

/**
 * Default values for budget items
 */
export const DEFAULT_VALUES = {
  CURRENCY: 'KES',
  YEAR: new Date().getFullYear(),
  STATUS: BudgetStatus.PLANNED
};

/**
 * Validation rules for budget data
 */
export const VALIDATION_RULES = {
  MIN_AMOUNT: 0,
  MAX_AMOUNT: 1000000000000, // 1 trillion
  MIN_YEAR: 2000,
  MAX_YEAR: 2030
};

/**
 * Chart color schemes for consistent visualization
 */
export const CHART_COLORS = {
  PRIMARY: ['#3b82f6', '#1d4ed8', '#1e40af', '#1e3a8a'],
  SUCCESS: ['#22c55e', '#16a34a', '#15803d', '#166534'],
  WARNING: ['#f59e0b', '#d97706', '#b45309', '#92400e'],
  DANGER: ['#ef4444', '#dc2626', '#b91c1c', '#991b1b']
};
