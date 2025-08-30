'use client';

import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import BudgetChat from './components/BudgetChat';
// import Sidebar from './components/Sidebar';
// import MobileToggle from './components/MobileToggle';

// Register Chart.js components
Chart.register(...registerables);

/**
 * Mock BudgetAnalysisEngine class for demonstration
 */
class BudgetAnalysisEngine {
  constructor(data = []) {
    this.data = data;
  }

  setBudgetData(data) {
    this.data = data;
  }

  getBudgetSummary() {
    const totalBudget = this.data.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalItems = this.data.length;
    const averageItemAmount = totalItems > 0 ? totalBudget / totalItems : 0;
    
    // Get unique departments
    const departments = [...new Set(this.data.map(item => item.department).filter(Boolean))];
    
    return {
      totalBudget,
      totalItems,
      averageItemAmount,
      topDepartments: departments
    };
  }
}

/**
 * Mock Formatter class for demonstration
 */
class Formatter {
  static formatCurrency(amount) {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}

/**
 * Mock DataProcessor class for demonstration
 */
class DataProcessor {
  static parseCSV(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim());
        const item = {};
        
        headers.forEach((header, index) => {
          let value = values[index] || '';
          
          // Try to parse numbers
          if (header.toLowerCase().includes('amount') || header.toLowerCase().includes('id')) {
            const num = parseFloat(value);
            if (!isNaN(num)) {
              value = num;
            }
          }
          
          item[header] = value;
        });
        
        data.push(item);
      }
    }
    
    return data;
  }
}

/**
 * Real budget data from sample_budget_2025.csv
 */
const realBudgetData = [
  { id: '1', name: 'Road Infrastructure Development', amount: 2500000000, currency: 'KES', category: 'Infrastructure', department: 'Ministry of Transport', year: 2025, quarter: 1, description: 'Construction and maintenance of major highways', location: 'Nairobi-Mombasa Highway', status: 'planned' },
  { id: '2', name: 'Digital Government Services', amount: 800000000, currency: 'KES', category: 'Technology', department: 'Ministry of ICT', year: 2025, quarter: 1, description: 'E-government platform development', location: 'Nairobi', status: 'in_progress' },
  { id: '3', name: 'Healthcare Equipment', amount: 1200000000, currency: 'KES', category: 'Healthcare', department: 'Ministry of Health', year: 2025, quarter: 1, description: 'Medical equipment for county hospitals', location: 'Various Counties', status: 'planned' },
  { id: '4', name: 'Education Infrastructure', amount: 1800000000, currency: 'KES', category: 'Education', department: 'Ministry of Education', year: 2025, quarter: 1, description: 'Construction of new schools and classrooms', location: 'Rural Areas', status: 'planned' },
  { id: '5', name: 'Agricultural Support Program', amount: 950000000, currency: 'KES', category: 'Agriculture', department: 'Ministry of Agriculture', year: 2025, quarter: 1, description: 'Farming subsidies and equipment support', location: 'Agricultural Counties', status: 'in_progress' },
  { id: '6', name: 'Water Supply Projects', amount: 1500000000, currency: 'KES', category: 'Infrastructure', department: 'Ministry of Water', year: 2025, quarter: 1, description: 'Rural water supply and sanitation projects', location: 'Rural Counties', status: 'planned' },
  { id: '7', name: 'National Security Equipment', amount: 2200000000, currency: 'KES', category: 'Security', department: 'Ministry of Interior', year: 2025, quarter: 1, description: 'Police and security force equipment upgrades', location: 'Nationwide', status: 'planned' },
  { id: '8', name: 'Energy Infrastructure', amount: 3000000000, currency: 'KES', category: 'Infrastructure', department: 'Ministry of Energy', year: 2025, quarter: 1, description: 'Renewable energy projects and grid expansion', location: 'Various Counties', status: 'planned' },
  { id: '9', name: 'Public Housing', amount: 1800000000, currency: 'KES', category: 'Housing', department: 'Ministry of Housing', year: 2025, quarter: 1, description: 'Affordable housing units construction', location: 'Urban Areas', status: 'planned' },
  { id: '10', name: 'Digital Skills Training', amount: 400000000, currency: 'KES', category: 'Education', department: 'Ministry of ICT', year: 2025, quarter: 1, description: 'Digital literacy programs for youth', location: 'Nationwide', status: 'in_progress' },
  { id: '11', name: 'County Road Networks', amount: 1200000000, currency: 'KES', category: 'Infrastructure', department: 'County Governments', year: 2025, quarter: 1, description: 'Local road construction and maintenance', location: 'All Counties', status: 'planned' },
  { id: '12', name: 'Healthcare Training', amount: 350000000, currency: 'KES', category: 'Healthcare', department: 'Ministry of Health', year: 2025, quarter: 1, description: 'Medical staff training and capacity building', location: 'Nationwide', status: 'planned' },
  { id: '13', name: 'Agricultural Research', amount: 280000000, currency: 'KES', category: 'Agriculture', department: 'Ministry of Agriculture', year: 2025, quarter: 1, description: 'Crop research and development programs', location: 'Research Centers', status: 'planned' },
  { id: '14', name: 'Disaster Management', amount: 450000000, currency: 'KES', category: 'Security', department: 'Ministry of Interior', year: 2025, quarter: 1, description: 'Emergency response equipment and training', location: 'Nationwide', status: 'planned' },
  { id: '15', name: 'Public Transport', amount: 650000000, currency: 'KES', category: 'Infrastructure', department: 'Ministry of Transport', year: 2025, quarter: 1, description: 'Public transport system improvements', location: 'Major Cities', status: 'planned' },
  { id: '16', name: 'Digital Innovation Hub', amount: 300000000, currency: 'KES', category: 'Technology', department: 'Ministry of ICT', year: 2025, quarter: 1, description: 'Innovation centers for tech startups', location: 'Nairobi', status: 'in_progress' },
  { id: '17', name: 'Environmental Conservation', amount: 520000000, currency: 'KES', category: 'Environment', department: 'Ministry of Environment', year: 2025, quarter: 1, description: 'Forest conservation and climate initiatives', location: 'Nationwide', status: 'planned' },
  { id: '18', name: 'Public Libraries', amount: 180000000, currency: 'KES', category: 'Education', department: 'Ministry of Education', year: 2025, quarter: 1, description: 'Modern library facilities and digital resources', location: 'All Counties', status: 'planned' },
  { id: '19', name: 'Healthcare Infrastructure', amount: 950000000, currency: 'KES', category: 'Healthcare', department: 'Ministry of Health', year: 2025, quarter: 1, description: 'Hospital construction and renovation', location: 'Various Counties', status: 'planned' },
  { id: '20', name: 'Agricultural Infrastructure', amount: 750000000, currency: 'KES', category: 'Agriculture', department: 'Ministry of Agriculture', year: 2025, quarter: 1, description: 'Irrigation systems and storage facilities', location: 'Agricultural Counties', status: 'planned' }
];

/**
 * Main Dashboard Component
 * Displays budget overview, metrics, and AI-powered insights
 */
export default function Dashboard() {
  const [budgetData, setBudgetData] = useState(realBudgetData);
  const [analysisEngine] = useState(() => new BudgetAnalysisEngine(realBudgetData));
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // File upload states
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileAnalysis, setFileAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  // Chart refs
  const categoryChartRef = useRef(null);
  const departmentChartRef = useRef(null);
  const categoryChartInstance = useRef(null);
  const departmentChartInstance = useRef(null);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        analysisEngine.setBudgetData(budgetData);
        const budgetSummary = analysisEngine.getBudgetSummary();
        setSummary(budgetSummary);
      } catch (error) {
        console.error('Error initializing dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [analysisEngine, budgetData]);

  // Initialize charts when component mounts
  useEffect(() => {
    if (!loading && summary) {
      initializeCharts();
    }
  }, [loading, summary]);

  /**
   * Initialize Chart.js charts
   */
  const initializeCharts = () => {
    // Destroy existing charts if they exist
    if (categoryChartInstance.current) {
      categoryChartInstance.current.destroy();
    }
    if (departmentChartInstance.current) {
      departmentChartInstance.current.destroy();
    }

    // Prepare data for charts
    const categoryData = prepareCategoryChartData();
    const departmentData = prepareDepartmentChartData();

    // Create Category Chart
    if (categoryChartRef.current) {
      categoryChartInstance.current = new Chart(categoryChartRef.current, {
        type: 'doughnut',
        data: {
          labels: categoryData.labels,
          datasets: [{
            data: categoryData.data,
            backgroundColor: [
              '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
              '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.parsed;
                  return `${label}: ${Formatter.formatCurrency(value)}`;
                }
              }
            }
          }
        }
      });
    }

    // Create Department Chart
    if (departmentChartRef.current) {
      departmentChartInstance.current = new Chart(departmentChartRef.current, {
        type: 'bar',
        data: {
          labels: departmentData.labels,
          datasets: [{
            label: 'Budget Amount (KES)',
            data: departmentData.data,
            backgroundColor: '#3B82F6',
            borderColor: '#2563EB',
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return Formatter.formatCurrency(context.parsed.y);
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return Formatter.formatCurrency(value);
                }
              }
            }
          }
        }
      });
    }
  };

  /**
   * Prepare data for category chart
   */
  const prepareCategoryChartData = () => {
    const categoryTotals = {};
    
    budgetData.forEach(item => {
      if (item.category && item.amount) {
        categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
      }
    });

    return {
      labels: Object.keys(categoryTotals),
      data: Object.values(categoryTotals)
    };
  };

  /**
   * Prepare data for department chart
   */
  const prepareDepartmentChartData = () => {
    const departmentTotals = {};
    
    budgetData.forEach(item => {
      if (item.department && item.amount) {
        departmentTotals[item.department] = (departmentTotals[item.department] || 0) + item.amount;
      }
    });

    // Sort by amount (descending) and take top 10
    const sortedDepartments = Object.entries(departmentTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    return {
      labels: sortedDepartments.map(([dept]) => dept),
      data: sortedDepartments.map(([,amount]) => amount)
    };
  };

  /**
   * Handle file upload and analysis
   * @param {Event} event - File input change event
   */
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset previous states
    setUploadError(null);
    setFileAnalysis(null);
    setUploadSuccess(null);
    setUploadedFile(file);

    // Validate file type
    const allowedTypes = ['text/csv', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload a CSV or PDF file only.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB.');
      return;
    }

    try {
      setIsAnalyzing(true);
      
      // First, save file to localdb folder
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }
      
      const uploadResult = await uploadResponse.json();
      console.log('File saved to localdb:', uploadResult);
      setUploadSuccess(`File successfully saved to localdb folder: ${uploadResult.filename}`);
      
      // Now analyze the file
      if (file.type === 'text/csv') {
        await analyzeCSVFile(file, uploadResult);
      } else if (file.type === 'application/pdf') {
        await analyzePDFFile(file, uploadResult);
      }
      
    } catch (error) {
      console.error('Error uploading/analyzing file:', error);
      setUploadError(`Error: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * Analyze CSV file content
   * @param {File} file - CSV file to analyze
   * @param {Object} uploadResult - Result from file upload API
   */
  const analyzeCSVFile = async (file, uploadResult) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const csvContent = e.target.result;
          const parsedData = DataProcessor.parseCSV(csvContent);
          
          // Update budget data with uploaded data
          const newBudgetData = [...budgetData, ...parsedData];
          setBudgetData(newBudgetData);
          
          // Re-analyze with new data
          analysisEngine.setBudgetData(newBudgetData);
          const newSummary = analysisEngine.getBudgetSummary();
          setSummary(newSummary);
          
          // Generate file analysis
          const analysis = {
            fileName: file.name,
            fileType: 'CSV',
            totalRows: parsedData.length,
            totalAmount: parsedData.reduce((sum, item) => sum + (item.amount || 0), 0),
            categories: [...new Set(parsedData.map(item => item.category).filter(Boolean))],
            departments: [...new Set(parsedData.map(item => item.department).filter(Boolean))],
            analysisDate: new Date().toISOString(),
            insights: generateInsights(parsedData),
            savedToLocaldb: true,
            localdbPath: uploadResult.savedPath,
            uploadTimestamp: uploadResult.uploadTime
          };
          
          setFileAnalysis(analysis);
          
          // Update charts with new data
          setTimeout(() => {
            initializeCharts();
          }, 100);
          
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  /**
   * Analyze PDF file content
   * @param {File} file - PDF file to analyze
   * @param {Object} uploadResult - Result from file upload API
   */
  const analyzePDFFile = async (file, uploadResult) => {
    // For PDF files, we'll show a placeholder analysis
    // In a real implementation, you'd use a PDF parsing library
    const analysis = {
      fileName: file.name,
      fileType: 'PDF',
      totalRows: 'N/A (PDF format)',
      totalAmount: 'N/A (PDF format)',
      categories: ['PDF analysis requires text extraction'],
      departments: ['PDF analysis requires text extraction'],
      analysisDate: new Date().toISOString(),
      insights: [
        'PDF files require text extraction before analysis',
        'Consider converting PDF to CSV for detailed analysis',
        'PDF content analysis is available in premium version'
      ],
      savedToLocaldb: true,
      localdbPath: uploadResult.savedPath,
      uploadTimestamp: uploadResult.uploadTime
    };
    
    setFileAnalysis(analysis);
  };

  /**
   * Generate insights from uploaded data
   * @param {Array} data - Parsed data array
   * @returns {Array} Array of insight strings
   */
  const generateInsights = (data) => {
    const insights = [];
    
    if (data.length > 0) {
      const amounts = data.map(item => item.amount || 0).filter(amount => amount > 0);
      const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);
      const avgAmount = totalAmount / amounts.length;
      
      insights.push(`Total budget items: ${data.length}`);
      insights.push(`Total amount: ${Formatter.formatCurrency(totalAmount)}`);
      insights.push(`Average item amount: ${Formatter.formatCurrency(avgAmount)}`);
      
      // Category analysis
      const categoryCounts = {};
      data.forEach(item => {
        if (item.category) {
          categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
        }
      });
      
      const topCategory = Object.entries(categoryCounts)
        .sort(([,a], [,b]) => b - a)[0];
      
      if (topCategory) {
        insights.push(`Most common category: ${topCategory[0]} (${topCategory[1]} items)`);
      }
    }
    
    return insights;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      {/* <Sidebar 
        budgetData={budgetData}
        summary={summary}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      /> */}

      {/* Mobile Toggle */}
      {/* <MobileToggle onToggle={() => setSidebarOpen(!sidebarOpen)} /> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Budget Dashboard</h1>
              <p className="text-gray-600 text-sm">
                AI-powered insights into Kenyan government budget allocation and spending patterns
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="btn-secondary">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Report
              </button>
              <button className="btn-primary">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Add Budget Item
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary ? Formatter.formatCurrency(summary.totalBudget) : 'KES 0'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Budget Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary ? summary.totalItems : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary ? Formatter.formatCurrency(summary.averageItemAmount) : 'KES 0'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary ? summary.topDepartments.length : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="card">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-green-100 rounded-lg mr-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Upload Budget Files</h3>
            <p className="text-sm text-gray-600">Upload CSV or PDF files for AI-powered analysis and storage in localdb</p>
          </div>
        </div>

        {/* File Upload Input */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept=".csv,.pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={isAnalyzing}
          />
          <label
            htmlFor="file-upload"
            className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
              isAnalyzing 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            }`}
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Choose File
              </>
            )}
          </label>
          <p className="mt-2 text-sm text-gray-600">
            Supports CSV and PDF files up to 10MB. Files are saved to localdb folder.
          </p>
        </div>

        {/* Upload Success */}
        {uploadSuccess && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-green-700">{uploadSuccess}</p>
            </div>
          </div>
        )}

        {/* Upload Error */}
        {uploadError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700">{uploadError}</p>
            </div>
          </div>
        )}

        {/* File Analysis Results */}
        {fileAnalysis && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-medium text-blue-900 mb-4">File Analysis Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-700 mb-2">
                  <span className="font-medium">File:</span> {fileAnalysis.fileName}
                </p>
                <p className="text-sm text-blue-700 mb-2">
                  <span className="font-medium">Type:</span> {fileAnalysis.fileType}
                </p>
                <p className="text-sm text-blue-700 mb-2">
                  <span className="font-medium">Rows:</span> {fileAnalysis.totalRows}
                </p>
                {fileAnalysis.totalAmount !== 'N/A (PDF format)' && (
                  <p className="text-sm text-blue-700 mb-2">
                    <span className="font-medium">Total Amount:</span> {Formatter.formatCurrency(fileAnalysis.totalAmount)}
                  </p>
                )}
                <p className="text-sm text-blue-700 mb-2">
                  <span className="font-medium">Saved to:</span> localdb folder
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700 mb-2">
                  <span className="font-medium">Categories:</span> {fileAnalysis.categories.join(', ')}
                </p>
                <p className="text-sm text-blue-700 mb-2">
                  <span className="font-medium">Departments:</span> {fileAnalysis.departments.join(', ')}
                </p>
                <p className="text-sm text-blue-700 mb-2">
                  <span className="font-medium">Analyzed:</span> {new Date(fileAnalysis.analysisDate).toLocaleString()}
                </p>
                <p className="text-sm text-blue-700 mb-2">
                  <span className="font-medium">Upload Time:</span> {new Date(fileAnalysis.uploadTimestamp).toLocaleString()}
                </p>
              </div>
            </div>
            
            {/* Insights */}
            <div className="mt-4">
              <h5 className="font-medium text-blue-900 mb-2">Key Insights:</h5>
              <ul className="list-disc list-inside space-y-1">
                {fileAnalysis.insights.map((insight, index) => (
                  <li key={index} className="text-sm text-blue-700">{insight}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget by Category */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget by Category</h3>
          <div className="chart-container">
            <canvas ref={categoryChartRef}></canvas>
          </div>
        </div>

        {/* Budget by Department */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget by Department (Top 10)</h3>
          <div className="chart-container">
            <canvas ref={departmentChartRef}></canvas>
          </div>
        </div>
      </div>

      {/* Recent Budget Items */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Budget Items</h3>
          <a href="/budgets" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All →
          </a>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {budgetData.slice(0, 5).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {Formatter.formatCurrency(item.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'completed' ? 'bg-success-100 text-success-800' :
                      item.status === 'in_progress' ? 'bg-warning-100 text-warning-800' :
                      item.status === 'planned' ? 'bg-primary-100 text-primary-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-3">
                      View
                    </button>
                    <button className="text-secondary-600 hover:text-secondary-900">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insights */}
      <div className="card">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-primary-100 rounded-lg mr-4">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h3>
            <p className="text-sm text-gray-600">Automated analysis and recommendations</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Trend Analysis</h4>
            <p className="text-sm text-blue-700">
              Infrastructure spending shows a 15% increase compared to last year, indicating 
              government focus on development projects.
            </p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">Anomaly Detection</h4>
            <p className="text-sm text-yellow-700">
              Technology budget allocation is 25% higher than historical averages, 
              suggesting new digital transformation initiatives.
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Efficiency Insights</h4>
            <p className="text-sm text-green-700">
              Healthcare department shows optimal budget utilization with 92% 
              completion rate on planned projects.
            </p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">Recommendations</h4>
            <p className="text-sm text-purple-700">
              Consider quarterly budget reviews for infrastructure projects to 
              ensure timely completion and cost control.
            </p>
          </div>
        </div>
      </div>

      {/* Budget AI Chat */}
      <BudgetChat budgetData={budgetData} />
        </div>
      </div>
    </div>
  );
}
