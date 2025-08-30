import { BudgetStatus, DEFAULT_VALUES, VALIDATION_RULES } from '@transparency-ai/types';

/**
 * Data Processing Utilities
 * Handles CSV parsing, data cleaning, and statistical calculations
 */
export class DataProcessor {
  /**
   * Parse CSV data and convert to structured format
   * @param {string} csvData - Raw CSV string
   * @returns {Array} Array of parsed objects
   */
  static parseCSV(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });
  }

  /**
   * Clean and validate budget data
   * @param {Array} data - Raw budget data
   * @returns {Array} Cleaned budget items
   */
  static cleanBudgetData(data) {
    return data
      .filter(row => row.amount && !isNaN(Number(row.amount)))
      .map(row => ({
        id: row.id || crypto.randomUUID(),
        name: row.name || 'Unnamed Item',
        amount: Number(row.amount),
        currency: row.currency || DEFAULT_VALUES.CURRENCY,
        category: row.category || 'Uncategorized',
        department: row.department || 'Unknown',
        year: Number(row.year) || DEFAULT_VALUES.YEAR,
        quarter: row.quarter ? Number(row.quarter) : undefined,
        description: row.description || '',
        location: row.location || '',
        status: row.status || DEFAULT_VALUES.STATUS,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
  }

  /**
   * Group data by a specific key
   * @param {Array} data - Array of objects to group
   * @param {string} key - Property name to group by
   * @returns {Object} Grouped data
   */
  static groupBy(data, key) {
    return data.reduce((groups, item) => {
      const groupKey = String(item[key]);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    }, {});
  }

  /**
   * Calculate summary statistics for numeric data
   * @param {Array<number>} data - Array of numbers
   * @returns {Object} Statistics object with sum, average, min, max, count
   */
  static calculateStats(data) {
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

/**
 * Formatting Utilities
 * Handles currency, numbers, percentages, and date formatting
 */
export class Formatter {
  /**
   * Format currency amounts
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code (default: KES)
   * @returns {string} Formatted currency string
   */
  static formatCurrency(amount, currency = 'KES') {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Format large numbers with abbreviations
   * @param {number} num - Number to format
   * @returns {string} Formatted number with suffix
   */
  static formatLargeNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  }

  /**
   * Format percentage values
   * @param {number} value - Value to calculate percentage for
   * @param {number} total - Total value
   * @returns {string} Formatted percentage
   */
  static formatPercentage(value, total) {
    if (total === 0) return '0%';
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(1)}%`;
  }

  /**
   * Format date for display
   * @param {Date} date - Date to format
   * @param {string} format - Format type: 'short', 'long', or 'relative'
   * @returns {string} Formatted date string
   */
  static formatDate(date, format = 'short') {
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
   * @param {Date} date - Date to compare
   * @returns {string} Relative time string
   */
  static getRelativeTime(date) {
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

/**
 * Chart Data Utilities
 * Prepares data for different chart types
 */
export class ChartDataProcessor {
  /**
   * Prepare data for different chart types
   * @param {Array} data - Raw data array
   * @param {string} chartType - Type of chart to prepare for
   * @param {Object} options - Chart-specific options
   * @returns {Array} Processed chart data
   */
  static prepareChartData(data, chartType, options = {}) {
    switch (chartType) {
      case 'bar':
        return this.prepareBarChartData(data, options);
      case 'pie':
        return this.preparePieChartData(data, options);
      case 'line':
        return this.prepareLineChartData(data, options);
      case 'treemap':
        return this.prepareTreemapData(data, options);
      default:
        return data;
    }
  }

  /**
   * Prepare data for bar charts
   * @param {Array} data - Raw data
   * @param {Object} options - Chart options
   * @returns {Array} Bar chart data
   */
  static prepareBarChartData(data, options) {
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
   * @param {Array} data - Raw data
   * @param {Object} options - Chart options
   * @returns {Array} Pie chart data
   */
  static preparePieChartData(data, options) {
    const { category, value } = options;
    const grouped = DataProcessor.groupBy(data, category);
    
    return Object.entries(grouped).map(([key, items]) => ({
      label: key,
      value: items.reduce((sum, item) => sum + (item[value] || 0), 0)
    }));
  }

  /**
   * Prepare data for line charts
   * @param {Array} data - Raw data
   * @param {Object} options - Chart options
   * @returns {Array} Line chart data
   */
  static prepareLineChartData(data, options) {
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
   * @param {Array} data - Raw data
   * @param {Object} options - Chart options
   * @returns {Array} Treemap data
   */
  static prepareTreemapData(data, options) {
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
   * @param {Array} data - Raw data
   * @param {string} category - Category field name
   * @param {string} value - Value field name
   * @param {string} parentCategory - Parent category field name
   * @returns {Array} Hierarchical data structure
   */
  static buildHierarchicalData(data, category, value, parentCategory) {
    const hierarchy = {};
    
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

/**
 * Validation Utilities
 * Provides data validation functions
 */
export class Validator {
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate required fields
   * @param {Object} data - Data object to validate
   * @param {Array<string>} requiredFields - Array of required field names
   * @returns {Array<string>} Array of validation error messages
   */
  static validateRequired(data, requiredFields) {
    const errors = [];
    
    requiredFields.forEach(field => {
      if (!data[field] || data[field].toString().trim() === '') {
        errors.push(`${field} is required`);
      }
    });
    
    return errors;
  }

  /**
   * Validate numeric range
   * @param {number} value - Value to validate
   * @param {number} min - Minimum allowed value
   * @param {number} max - Maximum allowed value
   * @returns {boolean} True if value is within range
   */
  static validateRange(value, min, max) {
    return value >= min && value <= max;
  }

  /**
   * Validate date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {boolean} True if start date is before end date
   */
  static validateDateRange(startDate, endDate) {
    return startDate < endDate;
  }
}

/**
 * Performance Utilities
 * Provides performance optimization functions
 */
export class PerformanceUtils {
  /**
   * Debounce function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  static debounce(func, wait) {
    let timeout;
    
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Throttle function calls
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  static throttle(func, limit) {
    let inThrottle;
    
    return (...args) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Measure execution time
   * @param {Function} fn - Function to measure
   * @returns {Object} Object with result and duration
   */
  static measureTime(fn) {
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
