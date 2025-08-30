// Budget Data Types
export interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  currency: string;
  category: BudgetCategory;
  department: string;
  year: number;
  quarter?: number;
  description?: string;
  location?: string;
  status: BudgetStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetCategory {
  id: string;
  name: string;
  parentId?: string;
  level: number;
  color?: string;
  icon?: string;
}

export interface BudgetDepartment {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  level: number;
  totalBudget: number;
  spentAmount: number;
  remainingAmount: number;
}

export interface BudgetYear {
  year: number;
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  startDate: Date;
  endDate: Date;
  status: BudgetYearStatus;
}

export enum BudgetStatus {
  PLANNED = 'planned',
  APPROVED = 'approved',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum BudgetYearStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  CLOSED = 'closed',
  AUDITED = 'audited'
}

// AI Analysis Types
export interface AIAnalysis {
  id: string;
  budgetItemId: string;
  type: AnalysisType;
  confidence: number;
  insights: string[];
  recommendations: string[];
  anomalies: Anomaly[];
  trends: Trend[];
  createdAt: Date;
}

export interface Anomaly {
  id: string;
  type: AnomalyType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  suggestedAction: string;
}

export interface Trend {
  id: string;
  direction: 'increasing' | 'decreasing' | 'stable';
  period: string;
  percentage: number;
  factors: string[];
}

export enum AnalysisType {
  TREND_ANALYSIS = 'trend_analysis',
  ANOMALY_DETECTION = 'anomaly_detection',
  COMPARATIVE_ANALYSIS = 'comparative_analysis',
  PREDICTIVE_ANALYSIS = 'predictive_analysis',
  EFFICIENCY_ANALYSIS = 'efficiency_analysis'
}

export enum AnomalyType {
  UNUSUAL_SPENDING = 'unusual_spending',
  BUDGET_OVERRUN = 'budget_overrun',
  UNDERSPENDING = 'underspending',
  SEASONAL_DEVIATION = 'seasonal_deviation',
  DEPARTMENT_COMPARISON = 'department_comparison'
}

// Visualization Types
export interface ChartConfig {
  id: string;
  type: ChartType;
  title: string;
  data: any[];
  options: ChartOptions;
  filters: ChartFilter[];
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins?: any;
  scales?: any;
  animation?: any;
}

export interface ChartFilter {
  id: string;
  name: string;
  type: 'select' | 'date' | 'range' | 'search';
  value: any;
  options?: any[];
}

export enum ChartType {
  BAR = 'bar',
  LINE = 'line',
  PIE = 'pie',
  DOUGHNUT = 'doughnut',
  TREEMAP = 'treemap',
  SCATTER = 'scatter',
  AREA = 'area',
  RADAR = 'radar',
  HEATMAP = 'heatmap',
  SANKEY = 'sankey'
}

// Dashboard Types
export interface Dashboard {
  id: string;
  name: string;
  description: string;
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardLayout {
  columns: number;
  rows: number;
  widgetPositions: WidgetPosition[];
}

export interface WidgetPosition {
  widgetId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'text';
  title: string;
  config: any;
  dataSource: string;
  refreshInterval?: number;
}

export interface DashboardFilter {
  id: string;
  name: string;
  type: FilterType;
  defaultValue: any;
  options?: any[];
}

export enum FilterType {
  DATE_RANGE = 'date_range',
  DEPARTMENT = 'department',
  CATEGORY = 'category',
  AMOUNT_RANGE = 'amount_range',
  STATUS = 'status',
  LOCATION = 'location'
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
  preferences: UserPreferences;
  createdAt: Date;
  lastLoginAt?: Date;
}

export enum UserRole {
  VIEWER = 'viewer',
  ANALYST = 'analyst',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export interface Permission {
  resource: string;
  actions: string[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'sw';
  currency: string;
  timezone: string;
  defaultDashboard?: string;
}

// Data Import/Export Types
export interface DataImport {
  id: string;
  filename: string;
  status: ImportStatus;
  totalRows: number;
  processedRows: number;
  errors: ImportError[];
  startedAt: Date;
  completedAt?: Date;
}

export interface ImportError {
  row: number;
  column: string;
  value: string;
  message: string;
}

export enum ImportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// Export Types
export interface ExportRequest {
  id: string;
  type: ExportType;
  format: ExportFormat;
  filters: any;
  status: ExportStatus;
  downloadUrl?: string;
  createdAt: Date;
  completedAt?: Date;
}

export enum ExportType {
  DASHBOARD = 'dashboard',
  CHART = 'chart',
  BUDGET_DATA = 'budget_data',
  ANALYSIS_REPORT = 'analysis_report'
}

export enum ExportFormat {
  PDF = 'pdf',
  PNG = 'png',
  CSV = 'csv',
  EXCEL = 'excel',
  JSON = 'json'
}

export enum ExportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}
