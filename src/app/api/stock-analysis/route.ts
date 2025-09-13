import { NextRequest, NextResponse } from 'next/server';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

interface CorrelationData {
  symbol1: string;
  symbol2: string;
  correlation: number;
  strength: 'Strong' | 'Moderate' | 'Weak';
}

interface AIInsight {
  type: 'correlation' | 'sector' | 'sentiment' | 'risk';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
}

interface AnalysisResponse {
  primaryStock: string;
  relatedStocks: string[];
  correlations: CorrelationData[];
  insights: AIInsight[];
  riskAssessment: {
    level: 'Low' | 'Medium' | 'High';
    factors: string[];
  };
  recommendations: string[];
}

// Mock stock data - in production, this would come from a real API
const mockStockData: Record<string, StockData> = {
  'AAPL': { symbol: 'AAPL', price: 185.50, change: 2.30, changePercent: 1.26, volume: 45000000 },
  'MSFT': { symbol: 'MSFT', price: 415.20, change: -1.80, changePercent: -0.43, volume: 28000000 },
  'GOOGL': { symbol: 'GOOGL', price: 138.90, change: 0.75, changePercent: 0.54, volume: 32000000 },
  'TSLA': { symbol: 'TSLA', price: 202.50, change: 5.20, changePercent: 2.63, volume: 85000000 },
  'NVDA': { symbol: 'NVDA', price: 822.80, change: 15.60, changePercent: 1.93, volume: 55000000 },
  'META': { symbol: 'META', price: 502.30, change: -3.40, changePercent: -0.67, volume: 18000000 },
  'AMZN': { symbol: 'AMZN', price: 178.20, change: 1.90, changePercent: 1.08, volume: 38000000 },
  'NFLX': { symbol: 'NFLX', price: 485.60, change: -2.10, changePercent: -0.43, volume: 12000000 },
  'CRM': { symbol: 'CRM', price: 245.80, change: 3.20, changePercent: 1.32, volume: 8000000 },
  'ORCL': { symbol: 'ORCL', price: 112.40, change: 0.90, changePercent: 0.81, volume: 22000000 }
};

// Sector mappings for related stock identification
const sectorMappings: Record<string, string[]> = {
  'Technology': ['AAPL', 'MSFT', 'GOOGL', 'META', 'NVDA', 'CRM', 'ORCL'],
  'Electric Vehicles': ['TSLA'],
  'E-commerce': ['AMZN'],
  'Streaming': ['NFLX']
};

// Historical correlation data (mock) <mcreference link="https://polygon.io/blog/finding-correlation-between-stocks" index="1">1</mcreference>
const correlationMatrix: Record<string, Record<string, number>> = {
  'AAPL': { 'MSFT': 0.72, 'GOOGL': 0.68, 'META': 0.65, 'NVDA': 0.58, 'TSLA': 0.45, 'AMZN': 0.62 },
  'MSFT': { 'AAPL': 0.72, 'GOOGL': 0.75, 'META': 0.70, 'NVDA': 0.63, 'TSLA': 0.42, 'AMZN': 0.68 },
  'GOOGL': { 'AAPL': 0.68, 'MSFT': 0.75, 'META': 0.82, 'NVDA': 0.71, 'TSLA': 0.48, 'AMZN': 0.73 },
  'TSLA': { 'AAPL': 0.45, 'MSFT': 0.42, 'GOOGL': 0.48, 'META': 0.41, 'NVDA': 0.55, 'AMZN': 0.38 },
  'NVDA': { 'AAPL': 0.58, 'MSFT': 0.63, 'GOOGL': 0.71, 'META': 0.68, 'TSLA': 0.55, 'AMZN': 0.61 },
  'META': { 'AAPL': 0.65, 'MSFT': 0.70, 'GOOGL': 0.82, 'NVDA': 0.68, 'TSLA': 0.41, 'AMZN': 0.69 },
  'AMZN': { 'AAPL': 0.62, 'MSFT': 0.68, 'GOOGL': 0.73, 'META': 0.69, 'NVDA': 0.61, 'TSLA': 0.38 }
};

function getCorrelationStrength(correlation: number): 'Strong' | 'Moderate' | 'Weak' {
  const abs = Math.abs(correlation);
  if (abs >= 0.7) return 'Strong';
  if (abs >= 0.5) return 'Moderate';
  return 'Weak';
}

function findRelatedStocks(primaryStock: string, threshold: number = 0.5): string[] {
  const correlations = correlationMatrix[primaryStock] || {};
  return Object.entries(correlations)
    .filter(([_, corr]) => Math.abs(corr) >= threshold)
    .sort(([_, a], [__, b]) => Math.abs(b) - Math.abs(a))
    .slice(0, 5)
    .map(([stock, _]) => stock);
}

function generateAIInsights(primaryStock: string, relatedStocks: string[], correlations: CorrelationData[]): AIInsight[] {
  const insights: AIInsight[] = [];
  const stockData = mockStockData[primaryStock];
  
  // Correlation insights <mcreference link="https://medium.com/@deepml1818/financial-analysis-toolkit-unveiling-stock-dynamics-and-correlation-in-python-34d2d65de2b8" index="4">4</mcreference>
  const strongCorrelations = correlations.filter(c => c.strength === 'Strong');
  if (strongCorrelations.length > 0) {
    insights.push({
      type: 'correlation',
      title: 'Strong Market Correlations Detected',
      description: `${primaryStock} shows strong correlation (>0.7) with ${strongCorrelations.length} stocks, indicating shared market drivers and sector dynamics.`,
      confidence: 0.85,
      actionable: true
    });
  }
  
  // Sector analysis
  const sector = Object.entries(sectorMappings).find(([_, stocks]) => stocks.includes(primaryStock))?.[0];
  if (sector) {
    const sectorStocks = sectorMappings[sector].filter(s => s !== primaryStock);
    const sectorPerformance = sectorStocks.map(s => mockStockData[s]?.changePercent || 0);
    const avgSectorPerformance = sectorPerformance.reduce((a, b) => a + b, 0) / sectorPerformance.length;
    
    insights.push({
      type: 'sector',
      title: `${sector} Sector Analysis`,
      description: `${primaryStock} belongs to ${sector} sector with average performance of ${avgSectorPerformance.toFixed(2)}%. ${stockData.changePercent > avgSectorPerformance ? 'Outperforming' : 'Underperforming'} sector average.`,
      confidence: 0.78,
      actionable: true
    });
  }
  
  // Sentiment-based insights
  if (stockData.changePercent > 2) {
    insights.push({
      type: 'sentiment',
      title: 'Strong Bullish Momentum',
      description: `${primaryStock} shows strong positive momentum (+${stockData.changePercent.toFixed(2)}%) with high volume, indicating positive market sentiment.`,
      confidence: 0.72,
      actionable: true
    });
  } else if (stockData.changePercent < -2) {
    insights.push({
      type: 'sentiment',
      title: 'Bearish Pressure Detected',
      description: `${primaryStock} experiencing downward pressure (${stockData.changePercent.toFixed(2)}%) which may affect correlated stocks.`,
      confidence: 0.68,
      actionable: true
    });
  }
  
  // Risk assessment insights
  const volatilityIndicator = Math.abs(stockData.changePercent);
  if (volatilityIndicator > 3) {
    insights.push({
      type: 'risk',
      title: 'High Volatility Alert',
      description: `${primaryStock} showing high volatility (${volatilityIndicator.toFixed(2)}%) which may indicate increased risk or opportunity.`,
      confidence: 0.80,
      actionable: true
    });
  }
  
  return insights;
}

function assessRisk(primaryStock: string, correlations: CorrelationData[]): { level: 'Low' | 'Medium' | 'High', factors: string[] } {
  const stockData = mockStockData[primaryStock];
  const factors: string[] = [];
  let riskScore = 0;
  
  // Volatility risk
  const volatility = Math.abs(stockData.changePercent);
  if (volatility > 3) {
    factors.push('High intraday volatility detected');
    riskScore += 2;
  } else if (volatility > 1.5) {
    factors.push('Moderate price movement observed');
    riskScore += 1;
  }
  
  // Correlation risk
  const highCorrelations = correlations.filter(c => Math.abs(c.correlation) > 0.8).length;
  if (highCorrelations > 2) {
    factors.push('High correlation with multiple stocks increases systemic risk');
    riskScore += 1;
  }
  
  // Volume analysis
  const avgVolume = 35000000; // Mock average
  if (stockData.volume > avgVolume * 1.5) {
    factors.push('Unusually high trading volume may indicate news or events');
    riskScore += 1;
  }
  
  if (riskScore >= 3) return { level: 'High', factors };
  if (riskScore >= 1) return { level: 'Medium', factors };
  return { level: 'Low', factors: factors.length > 0 ? factors : ['Normal market conditions'] };
}

function generateRecommendations(primaryStock: string, insights: AIInsight[], riskLevel: string): string[] {
  const recommendations: string[] = [];
  const stockData = mockStockData[primaryStock];
  
  // Performance-based recommendations
  if (stockData.changePercent > 2) {
    recommendations.push('Consider taking partial profits if holding long positions');
    recommendations.push('Monitor for potential reversal signals at resistance levels');
  } else if (stockData.changePercent < -2) {
    recommendations.push('Evaluate if decline presents buying opportunity');
    recommendations.push('Check fundamental factors driving the downturn');
  }
  
  // Risk-based recommendations
  if (riskLevel === 'High') {
    recommendations.push('Implement strict stop-loss orders');
    recommendations.push('Consider reducing position size due to elevated risk');
  } else if (riskLevel === 'Low') {
    recommendations.push('Stable conditions may support position building');
  }
  
  // Correlation-based recommendations
  const correlationInsights = insights.filter(i => i.type === 'correlation');
  if (correlationInsights.length > 0) {
    recommendations.push('Diversify across uncorrelated assets to reduce portfolio risk');
    recommendations.push('Monitor correlated stocks for confirmation signals');
  }
  
  return recommendations;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker') || 'AAPL';
    const includeAnalysis = searchParams.get('analysis') !== 'false';
    
    if (!mockStockData[ticker]) {
      return NextResponse.json(
        { error: `Stock data not available for ${ticker}` },
        { status: 404 }
      );
    }
    
    // Find related stocks based on correlation
    const relatedStocks = findRelatedStocks(ticker);
    
    // Calculate correlations
    const correlations: CorrelationData[] = relatedStocks.map(stock => ({
      symbol1: ticker,
      symbol2: stock,
      correlation: correlationMatrix[ticker]?.[stock] || 0,
      strength: getCorrelationStrength(correlationMatrix[ticker]?.[stock] || 0)
    }));
    
    let analysis: AnalysisResponse = {
      primaryStock: ticker,
      relatedStocks,
      correlations,
      insights: [],
      riskAssessment: { level: 'Low', factors: [] },
      recommendations: []
    };
    
    if (includeAnalysis) {
      // Generate AI insights
      analysis.insights = generateAIInsights(ticker, relatedStocks, correlations);
      
      // Assess risk
      analysis.riskAssessment = assessRisk(ticker, correlations);
      
      // Generate recommendations
      analysis.recommendations = generateRecommendations(ticker, analysis.insights, analysis.riskAssessment.level);
    }
    
    return NextResponse.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString(),
      disclaimer: 'This analysis is for educational purposes only and should not be considered as financial advice.'
    });
    
  } catch (error) {
    console.error('Stock analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze stock data' },
      { status: 500 }
    );
  }
}