import { 
  BudgetItem, 
  AIAnalysis, 
  AnalysisType, 
  Anomaly, 
  AnomalyType, 
  Trend,
  BudgetDepartment 
} from '@transparency-ai/types';
import { DataProcessor, Formatter } from '@transparency-ai/utils';

// AI Analysis Engine for Budget Transparency
export class BudgetAnalysisEngine {
  private budgetData: BudgetItem[] = [];
  private analysisCache: Map<string, AIAnalysis> = new Map();

  constructor(data?: BudgetItem[]) {
    if (data) {
      this.setBudgetData(data);
    }
  }

  /**
   * Set budget data for analysis
   */
  setBudgetData(data: BudgetItem[]): void {
    this.budgetData = data;
    this.analysisCache.clear(); // Clear cache when data changes
  }

  /**
   * Get comprehensive analysis for all budget items
   */
  async analyzeAll(): Promise<AIAnalysis[]> {
    const analyses: AIAnalysis[] = [];
    
    for (const item of this.budgetData) {
      const analysis = await this.analyzeItem(item.id);
      if (analysis) {
        analyses.push(analysis);
      }
    }
    
    return analyses;
  }

  /**
   * Analyze a specific budget item
   */
  async analyzeItem(itemId: string): Promise<AIAnalysis | null> {
    // Check cache first
    if (this.analysisCache.has(itemId)) {
      return this.analysisCache.get(itemId)!;
    }

    const item = this.budgetData.find(i => i.id === itemId);
    if (!item) return null;

    const analysis: AIAnalysis = {
      id: crypto.randomUUID(),
      budgetItemId: itemId,
      type: AnalysisType.TREND_ANALYSIS,
      confidence: 0.85,
      insights: [],
      recommendations: [],
      anomalies: [],
      trends: [],
      createdAt: new Date()
    };

    // Perform various analyses
    analysis.insights = await this.generateInsights(item);
    analysis.recommendations = await this.generateRecommendations(item);
    analysis.anomalies = await this.detectAnomalies(item);
    analysis.trends = await this.analyzeTrends(item);

    // Cache the analysis
    this.analysisCache.set(itemId, analysis);
    
    return analysis;
  }

  /**
   * Generate AI-powered insights for a budget item
   */
  private async generateInsights(item: BudgetItem): Promise<string[]> {
    const insights: string[] = [];
    
    // Analyze spending patterns
    const similarItems = this.findSimilarItems(item);
    if (similarItems.length > 0) {
      const avgAmount = DataProcessor.calculateStats(
        similarItems.map(i => i.amount)
      ).average;
      
      if (item.amount > avgAmount * 1.5) {
        insights.push(`This item is ${Formatter.formatPercentage(item.amount, avgAmount)} higher than similar items in the same category.`);
      } else if (item.amount < avgAmount * 0.5) {
        insights.push(`This item is ${Formatter.formatPercentage(avgAmount - item.amount, avgAmount)} lower than similar items in the same category.`);
      }
    }

    // Analyze seasonal patterns
    if (item.quarter) {
      const seasonalInsight = this.analyzeSeasonalPattern(item);
      if (seasonalInsight) {
        insights.push(seasonalInsight);
      }
    }

    // Analyze department efficiency
    const deptEfficiency = this.analyzeDepartmentEfficiency(item.department);
    if (deptEfficiency) {
      insights.push(deptEfficiency);
    }

    return insights;
  }

  /**
   * Generate actionable recommendations
   */
  private async generateRecommendations(item: BudgetItem): Promise<string[]> {
    const recommendations: string[] = [];
    
    // Budget optimization recommendations
    const similarItems = this.findSimilarItems(item);
    if (similarItems.length > 0) {
      const avgAmount = DataProcessor.calculateStats(
        similarItems.map(i => i.amount)
      ).average;
      
      if (item.amount > avgAmount * 1.2) {
        recommendations.push(`Consider reviewing this allocation as it's ${Formatter.formatPercentage(item.amount - avgAmount, avgAmount)} above the average for similar items.`);
      }
    }

    // Status-based recommendations
    if (item.status === 'planned') {
      recommendations.push('Monitor this item closely during implementation to ensure it stays within budget.');
    } else if (item.status === 'in_progress') {
      recommendations.push('Track actual spending against planned budget to identify potential overruns early.');
    }

    // Category-based recommendations
    if (item.category.includes('Infrastructure')) {
      recommendations.push('Infrastructure projects often have long-term benefits. Consider multi-year planning.');
    } else if (item.category.includes('Technology')) {
      recommendations.push('Technology investments should include maintenance and upgrade costs in future budgets.');
    }

    return recommendations;
  }

  /**
   * Detect anomalies in budget data
   */
  private async detectAnomalies(item: BudgetItem): Promise<Anomaly[]> {
    const anomalies: Anomaly[] = [];
    
    // Statistical anomaly detection using Z-score
    const similarItems = this.findSimilarItems(item);
    if (similarItems.length > 5) {
      const amounts = similarItems.map(i => i.amount);
      const stats = DataProcessor.calculateStats(amounts);
      const zScore = Math.abs((item.amount - stats.average) / this.calculateStandardDeviation(amounts, stats.average));
      
      if (zScore > 2.5) {
        anomalies.push({
          id: crypto.randomUUID(),
          type: AnomalyType.UNUSUAL_SPENDING,
          severity: zScore > 3.5 ? 'critical' : zScore > 3 ? 'high' : 'medium',
          description: `This budget item is ${zScore.toFixed(1)} standard deviations from the mean for similar items.`,
          impact: 'May indicate unusual circumstances or require investigation.',
          suggestedAction: 'Review the justification and compare with historical data.'
        });
      }
    }

    // Budget overrun detection
    if (item.status === 'in_progress' || item.status === 'completed') {
      // This would need actual spending data to be fully implemented
      // For now, we'll add a placeholder
      anomalies.push({
        id: crypto.randomUUID(),
        type: AnomalyType.BUDGET_OVERRUN,
        severity: 'medium',
        description: 'Monitor actual spending against planned budget.',
        impact: 'Budget overruns can affect other planned initiatives.',
        suggestedAction: 'Implement regular spending reviews and early warning systems.'
      });
    }

    return anomalies;
  }

  /**
   * Analyze trends in budget data
   */
  private async analyzeTrends(item: BudgetItem): Promise<Trend[]> {
    const trends: Trend[] = [];
    
    // Year-over-year trend analysis
    const yearlyData = this.budgetData.filter(i => 
      i.category === item.category && 
      i.department === item.department
    );
    
    const yearlyGroups = DataProcessor.groupBy(yearlyData, 'year');
    const years = Object.keys(yearlyGroups).map(Number).sort();
    
    if (years.length >= 2) {
      const currentYear = years[years.length - 1];
      const previousYear = years[years.length - 2];
      
      const currentTotal = yearlyGroups[currentYear].reduce((sum, i) => sum + i.amount, 0);
      const previousTotal = yearlyGroups[previousYear].reduce((sum, i) => sum + i.amount, 0);
      
      if (previousTotal > 0) {
        const change = ((currentTotal - previousTotal) / previousTotal) * 100;
        const direction = change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'stable';
        
        trends.push({
          id: crypto.randomUUID(),
          direction,
          period: `${previousYear} to ${currentYear}`,
          percentage: Math.abs(change),
          factors: this.identifyTrendFactors(item, change)
        });
      }
    }

    return trends;
  }

  /**
   * Find similar budget items for comparison
   */
  private findSimilarItems(item: BudgetItem): BudgetItem[] {
    return this.budgetData.filter(i => 
      i.id !== item.id &&
      i.category === item.category &&
      i.department === item.department &&
      i.year === item.year
    );
  }

  /**
   * Analyze seasonal patterns in budget data
   */
  private analyzeSeasonalPattern(item: BudgetItem): string | null {
    if (!item.quarter) return null;
    
    const seasonalItems = this.budgetData.filter(i => 
      i.category === item.category &&
      i.year === item.year
    );
    
    const quarterlyGroups = DataProcessor.groupBy(seasonalItems, 'quarter');
    const quarterAmounts = Object.entries(quarterlyGroups).map(([quarter, items]) => ({
      quarter: Number(quarter),
      total: items.reduce((sum, i) => sum + i.amount, 0)
    }));
    
    if (quarterAmounts.length >= 2) {
      const currentQuarter = quarterAmounts.find(q => q.quarter === item.quarter);
      const avgQuarter = quarterAmounts.reduce((sum, q) => sum + q.total, 0) / quarterAmounts.length;
      
      if (currentQuarter && currentQuarter.total > avgQuarter * 1.3) {
        return `This item shows higher spending in Q${item.quarter} compared to the quarterly average.`;
      }
    }
    
    return null;
  }

  /**
   * Analyze department efficiency
   */
  private analyzeDepartmentEfficiency(department: string): string | null {
    const deptItems = this.budgetData.filter(i => i.department === department);
    if (deptItems.length === 0) return null;
    
    const totalBudget = deptItems.reduce((sum, i) => sum + i.amount, 0);
    const completedItems = deptItems.filter(i => i.status === 'completed');
    
    if (completedItems.length > 0) {
      const completionRate = (completedItems.length / deptItems.length) * 100;
      if (completionRate < 70) {
        return `Department shows ${completionRate.toFixed(1)}% completion rate, which may indicate implementation challenges.`;
      }
    }
    
    return null;
  }

  /**
   * Calculate standard deviation for statistical analysis
   */
  private calculateStandardDeviation(values: number[], mean: number): number {
    const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  /**
   * Identify factors that may contribute to trends
   */
  private identifyTrendFactors(item: BudgetItem, change: number): string[] {
    const factors: string[] = [];
    
    if (change > 0) {
      factors.push('Increased demand for services');
      factors.push('Inflation and cost escalation');
      factors.push('New initiatives or projects');
    } else if (change < 0) {
      factors.push('Cost optimization measures');
      factors.push('Completed major projects');
      factors.push('Efficiency improvements');
    }
    
    return factors;
  }

  /**
   * Get summary statistics for the entire budget
   */
  getBudgetSummary(): {
    totalItems: number;
    totalBudget: number;
    averageItemAmount: number;
    topCategories: Array<{ category: string; total: number }>;
    topDepartments: Array<{ department: string; total: number }>;
  } {
    if (this.budgetData.length === 0) {
      return {
        totalItems: 0,
        totalBudget: 0,
        averageItemAmount: 0,
        topCategories: [],
        topDepartments: []
      };
    }

    const totalBudget = this.budgetData.reduce((sum, item) => sum + item.amount, 0);
    const averageItemAmount = totalBudget / this.budgetData.length;

    // Top categories
    const categoryGroups = DataProcessor.groupBy(this.budgetData, 'category');
    const topCategories = Object.entries(categoryGroups)
      .map(([category, items]) => ({
        category,
        total: items.reduce((sum, item) => sum + item.amount, 0)
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // Top departments
    const deptGroups = DataProcessor.groupBy(this.budgetData, 'department');
    const topDepartments = Object.entries(deptGroups)
      .map(([department, items]) => ({
        department,
        total: items.reduce((sum, item) => sum + item.amount, 0)
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return {
      totalItems: this.budgetData.length,
      totalBudget,
      averageItemAmount,
      topCategories,
      topDepartments
    };
  }
}

// Export the main class
export { BudgetAnalysisEngine };
