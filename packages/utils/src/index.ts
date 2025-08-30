import { BudgetItem, BudgetCategory, BudgetDepartment, ChartType } from '@transparency-ai/types';

// Data Processing Utilities
export class DataProcessor {
  /**
   * Parse CSV data and convert to structured format
   */
  static parseCSV(csvData: string): any[] {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });
  }

  /**
   * Clean and validate budget data
   */
  static cleanBudgetData(data: any[]): BudgetItem[] {
    return data
      .filter(row => row.amount && !isNaN(Number(row.amount)))
      .map(row => ({
        id: row.id || crypto.randomUUID(),
        name: row.name || 'Unnamed Item',
        amount: Number(row.amount),
        currency: row.currency || 'KES',
        category: row.category || 'Uncategorized',
        department: row.department || 'Unknown',
        year: Number(row.year) || new Date().getFullYear(),
        quarter: row.quarter ? Number(row.quarter) : undefined,
        description: row.description || '',
        location: row.location || '',
        status: row.status || 'planned',
        createdAt: new Date(),
        updatedAt: new Date()
      }));
  }

  /**
   * Group data by a specific key
   */
  static groupBy<T>(data: T[], key: keyof T): Record<string, T[]> {
    return data.reduce((groups, item) => {
      const groupKey = String(item[key]);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }

  /**
   * Calculate summary statistics for numeric data
   */
  static calculateStats(data: number[]): {
    sum: number;
    average: number;
    min: number;
    max: number;
    count: number;
  } {
    if (data.length === 0) {
      return { sum: 0, average: 0, min: 0, max: 0, count: 0 };
    }

    const sum = data.reduce((acc, val) => acc + val, 0);
    const average = sum / data.length;
    const min = Math.min(...data);
    const max = Math.max(...data);

    return { sum, average, min, max, count: data.length };
  }
}

// Formatting Utilities
export class Formatter {
  /**
   * Format currency amounts
   */
  static formatCurrency(amount: number, currency: string = 'KES'): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Format large numbers with abbreviations
   */
  static formatLargeNumber(num: number): string {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  }

  /**
   * Format percentage values
   */
  static formatPercentage(value: number, total: number): string {
    if (total === 0) return '0%';
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(1)}%`;
  }

  /**
   * Format date for display
   */
  static formatDate(date: Date, format: 'short' | 'long' | 'relative' = 'short'): string {
    if (format === 'relative') {
      return this.getRelativeTime(date);
    }
    
    if (format === 'long') {
      return date.toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    return date.toLocaleDateString('en-KE');
  }

  /**
   * Get relative time (e.g., "2 hours ago")
   */
  private static getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  }
}

// Chart Data Utilities
export class ChartDataProcessor {
  /**
   * Prepare data for different chart types
   */
  static prepareChartData(data: any[], chartType: ChartType, options: any = {}) {
    switch (chartType) {
      case ChartType.BAR:
        return this.prepareBarChartData(data, options);
      case ChartType.PIE:
        return this.preparePieChartData(data, options);
      case ChartType.LINE:
        return this.prepareLineChartData(data, options);
      case ChartType.TREEMAP:
        return this.prepareTreemapData(data, options);
      default:
        return data;
    }
  }

  /**
   * Prepare data for bar charts
   */
  private static prepareBarChartData(data: any[], options: any) {
    const { xAxis, yAxis, groupBy } = options;
    
    if (groupBy) {
      const grouped = DataProcessor.groupBy(data, groupBy);
      return Object.entries(grouped).map(([key, items]) => ({
        label: key,
        value: items.reduce((sum, item) => sum + (item[yAxis] || 0), 0)
      }));
    }
    
    return data.map(item => ({
      label: item[xAxis] || 'Unknown',
      value: item[yAxis] || 0
    }));
  }

  /**
   * Prepare data for pie charts
   */
  private static preparePieChartData(data: any[], options: any) {
    const { category, value } = options;
    const grouped = DataProcessor.groupBy(data, category);
    
    return Object.entries(grouped).map(([key, items]) => ({
      label: key,
      value: items.reduce((sum, item) => sum + (item[value] || 0), 0)
    }));
  }

  /**
   * Prepare data for line charts
   */
  private static prepareLineChartData(data: any[], options: any) {
    const { xAxis, yAxis, sortBy } = options;
    
    let processedData = data.map(item => ({
      x: item[xAxis] || new Date(),
      y: item[yAxis] || 0
    }));
    
    if (sortBy) {
      processedData.sort((a, b) => a.x - b.x);
    }
    
    return processedData;
  }

  /**
   * Prepare data for treemap charts
   */
  private static prepareTreemapData(data: any[], options: any) {
    const { category, value, parentCategory } = options;
    
    if (parentCategory) {
      return this.buildHierarchicalData(data, category, value, parentCategory);
    }
    
    return data.map(item => ({
      name: item[category] || 'Unknown',
      value: item[value] || 0
    }));
  }

  /**
   * Build hierarchical data structure for treemap
   */
  private static buildHierarchicalData(data: any[], category: string, value: string, parentCategory: string) {
    const hierarchy: any = {};
    
    data.forEach(item => {
      const parent = item[parentCategory] || 'Root';
      const child = item[category] || 'Unknown';
      const val = item[value] || 0;
      
      if (!hierarchy[parent]) {
        hierarchy[parent] = { name: parent, children: [] };
      }
      
      hierarchy[parent].children.push({
        name: child,
        value: val
      });
    });
    
    return Object.values(hierarchy);
  }
}

// Validation Utilities
export class Validator {
  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate required fields
   */
  static validateRequired(data: any, requiredFields: string[]): string[] {
    const errors: string[] = [];
    
    requiredFields.forEach(field => {
      if (!data[field] || data[field].toString().trim() === '') {
        errors.push(`${field} is required`);
      }
    });
    
    return errors;
  }

  /**
   * Validate numeric range
   */
  static validateRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  /**
   * Validate date range
   */
  static validateDateRange(startDate: Date, endDate: Date): boolean {
    return startDate < endDate;
  }
}

// Performance Utilities
export class PerformanceUtils {
  /**
   * Debounce function calls
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Throttle function calls
   */
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Measure execution time
   */
  static measureTime<T>(fn: () => T): { result: T; duration: number } {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    return { result, duration };
  }
}

// Export all utilities
export {
  DataProcessor,
  Formatter,
  ChartDataProcessor,
  Validator,
  PerformanceUtils
};
