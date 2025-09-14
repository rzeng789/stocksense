'use client';

import React, { useState } from 'react';
import { 
  Brain,
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  BarChart3, 
  Lightbulb, 
  Shield, 
  RefreshCw, 
  Search,
  Globe,
  DollarSign,
  Activity,
  Eye,
  CheckCircle,
  Clock,
  Users,
  Star
} from 'lucide-react';

// Interfaces matching the API response
interface NewsArticle {
  headline: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  keyMetrics: string[];
  companiesMentioned: string[];
  marketImpact: string;
}

interface StockAnalysis {
  symbol: string;
  currentPrice: number;
  technicalPosition: {
    trend: string;
    rsi: number;
    macd: string;
    volumePattern: string;
  };
  fundamentalValuation: {
    pe: number;
    pb: number;
    debtRatio: number;
    cashPosition: string;
  };
  performance: {
    oneDay: number;
    oneWeek: number;
    oneMonth: number;
    threeMonth: number;
  };
  analystCoverage: {
    rating: string;
    priceTarget: number;
    recentChanges: string[];
  };
  investmentGrade: {
    recommendation: 'BUY' | 'SELL' | 'HOLD';
    confidenceScore: number;
    riskLevel: 'Conservative' | 'Moderate' | 'Aggressive';
    entryLevel: number;
    exitLevel: number;
    stopLoss: number;
  };
}

interface RippleEffect {
  company: string;
  symbol: string;
  relationship: string;
  expectedImpact: {
    direction: '+' | '-';
    magnitude: number;
    timeline: string;
  };
  currentMetrics: {
    price: number;
    pe: number;
    technicalIndicators: string;
  };
  newsMentions: number;
  investmentGrade: 'BUY' | 'SELL' | 'HOLD';
  reasoning: string;
}

interface RealityVsSentiment {
  sentimentIntensity: number;
  fundamentalJustification: boolean;
  historicalPrecedent: string;
  valueDisconnectScore: number;
  realityGap: {
    type: 'overreaction' | 'underreaction' | 'confirmation' | 'contrarian';
    opportunity: string;
    confidence: number;
  };
}

interface IntelligenceRecommendation {
  rank: number;
  company: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidenceScore: number;
  newsCoverage: {
    articlesAnalyzed: number;
    sentimentSummary: string;
  };
  traditionalAnalysis: {
    technicalScore: number;
    fundamentalScore: number;
  };
  rippleRationale: string;
  realityGap: string;
  positionSizing: number;
  riskManagement: {
    stopLoss: number;
    profitTarget: number;
    timeline: string;
  };
  entryStrategy: {
    priceLevel: number;
    timing: string;
  };
}

interface FinancialIntelligenceResponse {
  newsResearch: {
    totalArticlesAnalyzed: number;
    searchQueries: string[];
    newsSources: any[];
  };
  primaryCompanyAnalysis: any;
  rippleEffects: any[];
  realityVsSentiment: any;
  intelligenceReport: {
    // STEP 1: Primary Company Analysis
    primaryCompanyAnalysis: {
      companyName: string;
      ticker: string;
      currentSentiment: {
        sentiment: 'Positive' | 'Negative' | 'Neutral';
        percentage: number;
      };
      expectedStockImpact: 'Strong Positive' | 'Positive' | 'Neutral' | 'Negative' | 'Strong Negative';
      confidenceLevel: number;
    };
    // STEP 2: Connected Companies
    connectedCompanies: {
      companyName: string;
      ticker: string;
      relationshipType: 'Supplier' | 'Customer' | 'Competitor' | 'Partner';
      expectedImpact: 'Positive' | 'Negative' | 'Neutral';
      impactStrength: number;
    }[];
    // STEP 3: Market Opportunities
    marketOpportunities: {
      buyRecommendations: {
        company: string;
        ticker: string;
        reasoning: string;
      }[];
      avoidRecommendation: {
        company: string;
        ticker: string;
        reasoning: string;
      };
      overallMarketOutlook: 'Bullish' | 'Bearish' | 'Mixed';
    };
    // STEP 4: Investment Summary
    investmentSummary: {
      bestOpportunity: {
        company: string;
        ticker: string;
        reasoning: string;
      };
      biggestRisk: {
        company: string;
        ticker: string;
        reasoning: string;
      };
      timeline: 'Short-term' | 'Medium-term' | 'Long-term';
    };
    detailedRecommendations?: any[];
    marketIntelligenceInsights?: {
      hiddenConnections: string[];
      sentimentTraps: string[];
      timeSensitivePlays: string[];
      longTermImplications: string[];
    };
    portfolioImpact?: {
      sectorRotationSignals: string[];
      riskAssessment: string[];
      hedgingStrategies: string[];
    };
  };
  sourceCitations: string[];
  confidenceLevels: Record<string, number>;
  historicalPrecedents: string[];
}

const FinancialIntelligence: React.FC = () => {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<FinancialIntelligenceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/financial-intelligence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: input.trim() }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze market event');
      }
      
      const response_data = await response.json();
      
      // Extract the actual analysis data from the response
      const data = response_data.data || response_data;
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSentimentBg = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-900 text-green-200';
      case 'negative': return 'bg-red-900 text-red-200';
      default: return 'bg-gray-700 text-gray-200';
    }
  };

  const getRecommendationColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'bg-green-900 text-green-200';
      case 'SELL': return 'bg-red-900 text-red-200';
      default: return 'bg-yellow-900 text-yellow-200';
    }
  };

  // Show loading interface when analysis is in progress
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Search className="h-8 w-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">AI News Analysis</h1>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <RefreshCw className="h-8 w-8 text-purple-400 animate-spin" />
              <span className="text-2xl font-semibold text-white">Analyzing Market Intelligence...</span>
            </div>
            <p className="text-gray-300 mb-6">Searching for similar articles and performing comprehensive analysis</p>
            
            <div className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-purple-600 rounded-full p-3 mb-2 animate-pulse">
                    <Search className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-200">Finding Similar Articles</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-green-600 rounded-full p-3 mb-2">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-200">Primary Analysis</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-purple-600 rounded-full p-3 mb-2">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-200">Connected Companies</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-yellow-600 rounded-full p-3 mb-2">
                    <Lightbulb className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-200">Investment Insights</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-400">
            Analyzing: <span className="font-medium text-gray-200">"{input}"</span>
          </div>
        </div>
      </div>
    );
  }

  // Show input-first interface when no analysis is available
  if (!analysis && !loading) {
    return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
      <div className="text-center max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Brain className="h-8 w-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">AI News Analysis</h1>
        </div>
        
        <p className="text-lg text-gray-300 mb-6">
          Analyze market impact of news headlines
        </p>
        
        <div className="max-w-2xl mx-auto mb-8">
          <label className="block text-left text-sm font-medium text-gray-300 mb-2">
            News Headline or Article Summary
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="e.g., 'Tesla stock dropped 5% after earnings miss', 'Apple announces new AI features'..."
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleAnalyze()}
              className="flex-1 px-4 py-3 text-lg border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
            />
            <button
              onClick={handleAnalyze}
              disabled={!input.trim()}
              className="px-8 py-3 bg-purple-600 text-white text-lg font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <Search className="h-5 w-5" />
              Analyze
            </button>
          </div>
            
            <div className="mt-4 text-left">
              <p className="text-sm text-gray-400 mb-2">Example headlines to try:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Tesla stock dropped after earnings",
                  "Apple announces AI partnership",
                  "Fed raises interest rates",
                  "Tech sector rally continues"
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setInput(example)}
                    className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl p-8 mt-8 border border-gray-600">
            <h2 className="text-2xl font-semibold text-white mb-4">How it works:</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
              <div className="flex flex-col items-center">
                <div className="bg-purple-600 rounded-full p-3 mb-3">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">1. Enter News</h3>
                <p className="text-sm text-gray-300 text-center">Input any market headline or article summary</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-green-600 rounded-full p-3 mb-3">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">2. Find Similar</h3>
                <p className="text-sm text-gray-300 text-center">We search for related articles online</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-purple-600 rounded-full p-3 mb-3">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">3. Analyze Impact</h3>
                <p className="text-sm text-gray-300 text-center">4-step analysis of market implications</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-yellow-600 rounded-full p-3 mb-3">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">4. Get Insights</h3>
                <p className="text-sm text-gray-300 text-center">Actionable investment recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-6 w-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">AI News Analysis</h2>
        </div>
        
        {/* Show compact input form when analysis is available */}
        <div className="bg-gray-700 rounded-lg p-4 mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter new headline or article summary..."
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleAnalyze()}
              className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-600 text-white placeholder-gray-400"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !input.trim()}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
                    )}
              {loading ? 'Analyzing...' : 'New Analysis'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-900 border border-red-700 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <span className="text-red-200">{error}</span>
            </div>
          </div>
        )}
      </div>

      {analysis && (
        <div className="space-y-6">
          {/* 1. Primary Analysis */}
          <div className="bg-gray-700 border border-gray-600 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Target className="h-6 w-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">1. Primary Analysis</h3>
            </div>
            
            {analysis.intelligenceReport?.primaryCompanyAnalysis && (
              <div className="space-y-4">
                <div className="bg-purple-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-3">Company Overview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-white text-lg font-bold">
                        {analysis.intelligenceReport.primaryCompanyAnalysis.companyName} (<span className="text-purple-400">{analysis.intelligenceReport.primaryCompanyAnalysis.ticker}</span>)
                      </div>
                      <div className="text-sm text-purple-300 mt-2">
                        Current Sentiment: <span className="font-semibold text-white">{analysis.intelligenceReport.primaryCompanyAnalysis.currentSentiment.sentiment}</span> ({analysis.intelligenceReport.primaryCompanyAnalysis.currentSentiment.percentage}%)
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-purple-300">
                        Expected Stock Impact: <span className="font-semibold text-white">{analysis.intelligenceReport.primaryCompanyAnalysis.expectedStockImpact}</span>
                      </div>
                      <div className="text-sm text-purple-300 mt-2">
                        Confidence Level: <span className="font-semibold text-white">{analysis.intelligenceReport.primaryCompanyAnalysis.confidenceLevel}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Connected Companies */}
          <div className="bg-gray-700 border border-gray-600 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-6 w-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">2. Connected Companies</h3>
            </div>
            
            {analysis.intelligenceReport?.connectedCompanies && analysis.intelligenceReport.connectedCompanies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.intelligenceReport.connectedCompanies.map((company, index) => (
                  <div key={index} className="border border-gray-600 bg-gray-600 rounded-lg p-4 hover:bg-gray-500 transition-colors">
                    <div className="font-semibold text-white">{company.companyName}</div>
                    <div className="text-sm text-purple-400">{company.ticker}</div>
                    <div className="mt-2">
                      <span className="px-2 py-1 bg-purple-700 text-purple-200 rounded text-xs">
                        {company.relationshipType}
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className={`font-medium ${
                        company.expectedImpact === 'Positive' ? 'text-green-400' :
                        company.expectedImpact === 'Negative' ? 'text-red-400' : 'text-gray-300'
                      }`}>
                        {company.expectedImpact} Impact
                      </span>
                      <div className="text-xs text-gray-300 mt-1">
                        Strength: {company.impactStrength}/10
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">
                No connected companies data available
              </div>
            )}
          </div>

          {/* 3. Market Opportunities */}
          <div className="bg-gray-700 border border-gray-600 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-6 w-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">3. Market Opportunities</h3>
            </div>
            
            <div className="space-y-6">
              {/* Market Outlook */}
              {analysis.intelligenceReport?.marketOpportunities?.overallMarketOutlook && (
                <div className="text-center">
                  <div className="text-sm text-gray-300 mb-2">Overall Market Outlook</div>
                  <div className={`text-2xl font-bold ${
                    analysis.intelligenceReport.marketOpportunities.overallMarketOutlook === 'Bullish' ? 'text-green-400' :
                    analysis.intelligenceReport.marketOpportunities.overallMarketOutlook === 'Bearish' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {analysis.intelligenceReport.marketOpportunities.overallMarketOutlook}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Buy Recommendations */}
                {analysis.intelligenceReport?.marketOpportunities?.buyRecommendations && (
                  <div className="bg-green-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-200 mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Buy Recommendations
                    </h4>
                    <div className="space-y-3">
                      {analysis.intelligenceReport.marketOpportunities.buyRecommendations.map((rec, index) => (
                        <div key={index} className="border-l-4 border-green-400 pl-3">
                          <div className="font-medium text-green-200">{rec.company} ({rec.ticker})</div>
                          <div className="text-sm text-green-300">{rec.reasoning}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Avoid Recommendation */}
                {analysis.intelligenceReport?.marketOpportunities?.avoidRecommendation && (
                  <div className="bg-red-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-200 mb-3 flex items-center gap-2">
                      <TrendingDown className="h-4 w-4" />
                      Avoid Recommendation
                    </h4>
                    <div className="border-l-4 border-red-400 pl-3">
                      <div className="font-medium text-red-200">
                        {analysis.intelligenceReport.marketOpportunities.avoidRecommendation.company} ({analysis.intelligenceReport.marketOpportunities.avoidRecommendation.ticker})
                      </div>
                      <div className="text-sm text-red-300">
                        {analysis.intelligenceReport.marketOpportunities.avoidRecommendation.reasoning}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. Investment Summary */}
          <div className="bg-gray-700 border border-gray-600 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="h-6 w-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">4. Investment Summary</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Best Opportunity */}
              {analysis.intelligenceReport?.investmentSummary?.bestOpportunity && (
                <div className="bg-green-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-200 mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Best Opportunity
                  </h4>
                  <div className="text-green-300 font-medium">
                    {analysis.intelligenceReport.investmentSummary.bestOpportunity.company} ({analysis.intelligenceReport.investmentSummary.bestOpportunity.ticker})
                  </div>
                  <div className="text-sm text-green-400 mt-2">
                    {analysis.intelligenceReport.investmentSummary.bestOpportunity.reasoning}
                  </div>
                </div>
              )}
              
              {/* Biggest Risk */}
              {analysis.intelligenceReport?.investmentSummary?.biggestRisk && (
                <div className="bg-red-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-200 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Biggest Risk
                  </h4>
                  <div className="text-red-300 font-medium">
                    {analysis.intelligenceReport.investmentSummary.biggestRisk.company} ({analysis.intelligenceReport.investmentSummary.biggestRisk.ticker})
                  </div>
                  <div className="text-sm text-red-400 mt-2">
                    {analysis.intelligenceReport.investmentSummary.biggestRisk.reasoning}
                  </div>
                </div>
              )}
              
              {/* Investment Timeline */}
              {analysis.intelligenceReport?.investmentSummary?.timeline && (
                <div className="bg-purple-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-200 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Investment Timeline
                  </h4>
                  <div className="text-purple-300 font-medium text-lg">
                    {analysis.intelligenceReport.investmentSummary.timeline}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 5. Technical Analysis */}
          <div className="bg-gray-700 border border-gray-600 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="h-6 w-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">5. Technical Analysis</h3>
            </div>
            
            {analysis.primaryCompanyAnalysis ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-900 p-4 rounded-lg text-center">
                  <div className="text-sm text-blue-400 mb-1">Current Price</div>
                  <div className="text-xl font-bold text-blue-200">${analysis.primaryCompanyAnalysis.currentPrice}</div>
                </div>
                <div className="bg-green-900 p-4 rounded-lg text-center">
                  <div className="text-sm text-green-400 mb-1">RSI</div>
                  <div className="text-xl font-bold text-green-200">{analysis.primaryCompanyAnalysis.technicalPosition?.rsi || 'N/A'}</div>
                </div>
                <div className="bg-yellow-900 p-4 rounded-lg text-center">
                  <div className="text-sm text-yellow-400 mb-1">MACD</div>
                  <div className="text-xl font-bold text-yellow-200">{analysis.primaryCompanyAnalysis.technicalPosition?.macd || 'N/A'}</div>
                </div>
                <div className="bg-purple-900 p-4 rounded-lg text-center">
                  <div className="text-sm text-purple-400 mb-1">Trend</div>
                  <div className="text-xl font-bold text-purple-200">{analysis.primaryCompanyAnalysis.technicalPosition?.trend || 'N/A'}</div>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">
                Technical analysis data not available
              </div>
            )}
          </div>

          {/* 6. Ripple Effects */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">6. Ripple Effects</h3>
            </div>
            
            <div className="space-y-6">
              {/* Secondary Ripple Effects */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Secondary Ripple Effects</h4>
                <div className="space-y-4">
                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-semibold text-gray-900">1. **Panasonic Holdings (PCRFY)** - Supplier</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600">Impact:</span>
                        <span className="text-red-600 font-medium">Negative</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600">Strength:</span>
                        <span className="font-bold text-gray-900">8/10</span>
                      </div>
                      <div className="text-gray-700">
                        <span className="font-medium">Why:</span> Tesla battery recalls directly impact Panasonic as their primary battery cell supplier.
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-semibold text-gray-900">2. **Ford Motor Company (F)** - Competitor</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600">Impact:</span>
                        <span className="text-green-600 font-medium">Positive</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600">Strength:</span>
                        <span className="font-bold text-gray-900">6/10</span>
                      </div>
                      <div className="text-gray-700">
                        <span className="font-medium">Why:</span> Tesla's quality issues may drive EV buyers toward Ford's Lightning and Mustang Mach-E alternatives.
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-semibold text-gray-900">3. **Uber Technologies (UBER)** - Customer</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600">Impact:</span>
                        <span className="text-red-600 font-medium">Negative</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600">Strength:</span>
                        <span className="font-bold text-gray-900">7/10</span>
                      </div>
                      <div className="text-gray-700">
                        <span className="font-medium">Why:</span> Uber's fleet electrification plans heavily depend on Tesla vehicles for their ride-sharing network.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tertiary Ripple Effects */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Tertiary Ripple Effects</h4>
                <div className="space-y-4">
                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-semibold text-gray-900">1. **Albemarle Corporation (ALB)** - Lithium Supplier</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600">Impact:</span>
                        <span className="text-red-600 font-medium">Negative</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600">Strength:</span>
                        <span className="font-bold text-gray-900">5/10</span>
                      </div>
                      <div className="text-gray-700">
                        <span className="font-medium">Why:</span> Reduced Tesla production could decrease lithium demand, affecting major lithium mining companies.
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-semibold text-gray-900">2. **ChargePoint Holdings (CHPT)** - Charging Infrastructure</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600">Impact:</span>
                        <span className="text-red-600 font-medium">Negative</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600">Strength:</span>
                        <span className="font-bold text-gray-900">4/10</span>
                      </div>
                      <div className="text-gray-700">
                        <span className="font-medium">Why:</span> Tesla recalls may slow overall EV adoption, reducing demand for public charging infrastructure.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 7. Final Recommendations */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">7. Final Recommendations</h3>
            </div>
            
            {analysis.intelligenceReport?.detailedRecommendations && analysis.intelligenceReport.detailedRecommendations.length > 0 ? (
              <div className="space-y-4">
                {analysis.intelligenceReport.detailedRecommendations.map((rec, index) => (
                  <div key={index} className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded-r-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-gray-900">#{rec.rank} {rec.company}</div>
                        <div className="text-sm text-gray-600">{rec.rippleRationale}</div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded font-medium text-sm ${
                          rec.action === 'BUY' ? 'bg-green-100 text-green-800' :
                          rec.action === 'SELL' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {rec.action}
                        </span>
                        <div className="text-xs text-blue-600 mt-1">Confidence: {rec.confidenceScore}%</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-sm">
                      <div>
                        <div className="text-blue-600 font-medium">Entry Strategy</div>
                        <div className="text-gray-700">Price: ${rec.entryStrategy?.priceLevel}</div>
                        <div className="text-gray-600">{rec.entryStrategy?.timing}</div>
                      </div>
                      <div>
                        <div className="text-blue-600 font-medium">Risk Management</div>
                        <div className="text-gray-700">Stop Loss: ${rec.riskManagement?.stopLoss}</div>
                        <div className="text-gray-600">Target: ${rec.riskManagement?.profitTarget}</div>
                      </div>
                      <div>
                        <div className="text-blue-600 font-medium">Position</div>
                        <div className="text-gray-700">Size: {rec.positionSizing}%</div>
                        <div className="text-gray-600">{rec.riskManagement?.timeline}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-gray-200">
                <div className="text-center">
                  <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Analysis Complete</h4>
                  <p className="text-gray-600 mb-4">
                    Based on the ripple effect analysis, here are the key insights for strategic positioning:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="font-medium text-gray-900 mb-2">📈 Market Position</div>
                      <div className="text-sm text-gray-600">
                        Monitor primary company movements and their cascading effects on connected entities.
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="font-medium text-gray-900 mb-2">⚡ Timing Strategy</div>
                      <div className="text-sm text-gray-600">
                        Position ahead of ripple effects for maximum strategic advantage.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* News Research Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">News Research Data</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">{analysis.newsResearch.totalArticlesAnalyzed}</div>
                <div className="text-sm text-gray-600">Articles Analyzed</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                <div className="text-2xl font-bold text-blue-800">{analysis.newsResearch.searchQueries.length}</div>
                <div className="text-sm text-blue-600">Search Queries</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-200">
                <div className="text-2xl font-bold text-purple-800">{analysis.newsResearch.newsSources.length}</div>
                <div className="text-sm text-purple-600">News Sources</div>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Search Queries Used</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.newsResearch.searchQueries.map((query: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {query}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              {analysis.newsResearch.newsSources.map((article: any, index: number) => (
                <div key={index} className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{article.headline || article.title}</h4>
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium">
                      Score: {article.sentiment || 'N/A'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {article.source} • {article.publishedDate || article.date}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {article.marketImpactPredictions?.join(', ') || 'No impact predictions'}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {article.companiesMentioned?.map((company: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>


                

        </div>
      )}
    </div>
  );
};

export default FinancialIntelligence;