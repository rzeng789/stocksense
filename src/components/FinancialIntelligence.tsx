'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  Brain, 
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
  const [activeTab, setActiveTab] = useState<'summary' | 'news' | 'step1' | 'step2' | 'step3' | 'step4' | 'analysis' | 'recommendations' | 'ripple' | 'sentiment'>('summary');

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
      
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSentimentBg = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'bg-green-100 text-green-800';
      case 'SELL': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Financial Intelligence System</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Elite automated research and analysis for market events. Enter any headline or market event for comprehensive intelligence.
        </p>
        
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g., 'Tesla stock dropped', 'Apple earnings beat', 'Tech sector rally'..."
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleAnalyze()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !input.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}
      </div>

      {analysis && (
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'summary' as const, label: 'Executive Summary', icon: Target },
                { id: 'news' as const, label: 'News Research', icon: Globe },
                { id: 'step1' as const, label: 'Step 1: Primary Analysis', icon: BarChart3 },
                { id: 'step2' as const, label: 'Step 2: Connected Companies', icon: Activity },
                { id: 'step3' as const, label: 'Step 3: Market Opportunities', icon: TrendingUp },
                { id: 'step4' as const, label: 'Step 4: Investment Summary', icon: CheckCircle },
                { id: 'analysis' as const, label: 'Technical Analysis', icon: BarChart3 },
                { id: 'ripple' as const, label: 'Ripple Effects', icon: Activity },
                { id: 'sentiment' as const, label: 'Reality vs Sentiment', icon: Eye },
                { id: 'recommendations' as const, label: 'Recommendations', icon: Lightbulb }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Executive Summary</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Primary Company Overview */}
                  {analysis.intelligenceReport?.primaryCompanyAnalysis && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Primary Company</h4>
                      <div className="space-y-2">
                        <div className="text-blue-800">
                          <strong>{analysis.intelligenceReport.primaryCompanyAnalysis.companyName}</strong> ({analysis.intelligenceReport.primaryCompanyAnalysis.ticker})
                        </div>
                        <div className="text-sm text-blue-700">
                          Sentiment: {analysis.intelligenceReport.primaryCompanyAnalysis.currentSentiment.sentiment} ({analysis.intelligenceReport.primaryCompanyAnalysis.currentSentiment.percentage}%)
                        </div>
                        <div className="text-sm text-blue-700">
                          Expected Impact: {analysis.intelligenceReport.primaryCompanyAnalysis.expectedStockImpact}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Best Opportunity */}
                  {analysis.intelligenceReport?.investmentSummary?.bestOpportunity && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Best Opportunity</h4>
                      <div className="space-y-2">
                        <div className="text-green-800">
                          <strong>{analysis.intelligenceReport.investmentSummary.bestOpportunity.company}</strong> ({analysis.intelligenceReport.investmentSummary.bestOpportunity.ticker})
                        </div>
                        <div className="text-sm text-green-700">
                          {analysis.intelligenceReport.investmentSummary.bestOpportunity.reasoning}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Market Outlook */}
                  {analysis.intelligenceReport?.marketOpportunities?.overallMarketOutlook && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-900 mb-2">Market Outlook</h4>
                      <div className={`text-lg font-bold ${
                        analysis.intelligenceReport.marketOpportunities.overallMarketOutlook === 'Bullish' ? 'text-green-600' :
                        analysis.intelligenceReport.marketOpportunities.overallMarketOutlook === 'Bearish' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {analysis.intelligenceReport.marketOpportunities.overallMarketOutlook}
                      </div>
                    </div>
                  )}
                  
                  {/* Investment Timeline */}
                  {analysis.intelligenceReport?.investmentSummary?.timeline && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Investment Timeline</h4>
                      <div className="text-purple-800 font-medium">
                        {analysis.intelligenceReport.investmentSummary.timeline}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Top Recommendations */}
                {analysis.intelligenceReport?.marketOpportunities?.buyRecommendations && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Top Buy Recommendations</h4>
                    <div className="space-y-2">
                      {analysis.intelligenceReport.marketOpportunities.buyRecommendations.map((rec, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <strong>{rec.company} ({rec.ticker})</strong> - {rec.reasoning}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">{analysis.newsResearch.totalArticlesAnalyzed}</div>
                  <div className="text-sm text-gray-600">Articles Analyzed</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-900">{analysis.newsResearch.searchQueries.length}</div>
                  <div className="text-sm text-blue-600">Search Queries</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-900">{analysis.newsResearch.newsSources.length}</div>
                  <div className="text-sm text-purple-600">News Sources</div>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Search Queries Used</h4>
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
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{article.headline || article.title}</h4>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                        Score: {article.sentiment || 'N/A'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {article.source} • {article.publishedDate || article.date}
                    </div>
                    <div className="text-sm text-gray-700 mb-2">
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
          )}

          {activeTab === 'analysis' && analysis.primaryCompanyAnalysis && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">{analysis.primaryCompanyAnalysis?.ticker || 'N/A'} Analysis</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Current Price</div>
                    <div className="text-2xl font-bold text-gray-900">${analysis.primaryCompanyAnalysis?.currentPrice || 'N/A'}</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-600">P/E Ratio</div>
                    <div className="text-2xl font-bold text-blue-900">{analysis.primaryCompanyAnalysis?.fundamentalValuation?.peRatio || 'N/A'}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-green-600">RSI</div>
                    <div className="text-2xl font-bold text-green-900">{analysis.primaryCompanyAnalysis?.technicalPosition?.rsi || 'N/A'}</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-sm text-yellow-600">Recommendation</div>
                    <div className="text-2xl font-bold text-yellow-900">{analysis.primaryCompanyAnalysis?.investmentGrade?.recommendation || 'N/A'}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">1 Day:</span>
                        <span className={analysis.primaryCompanyAnalysis?.recentPerformance?.oneDay >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {analysis.primaryCompanyAnalysis?.recentPerformance?.oneDay >= 0 ? '+' : ''}{analysis.primaryCompanyAnalysis?.recentPerformance?.oneDay || 'N/A'}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">1 Week:</span>
                        <span className={analysis.primaryCompanyAnalysis?.recentPerformance?.oneWeek >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {analysis.primaryCompanyAnalysis?.recentPerformance?.oneWeek >= 0 ? '+' : ''}{analysis.primaryCompanyAnalysis?.recentPerformance?.oneWeek || 'N/A'}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Investment Grade</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Confidence:</span>
                        <span className="text-gray-900">{analysis.primaryCompanyAnalysis?.investmentGrade?.confidenceScore || 'N/A'}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk Level:</span>
                        <span className="text-gray-900">{analysis.primaryCompanyAnalysis?.investmentGrade?.riskLevel || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Primary Company Analysis */}
          {activeTab === 'step1' && analysis.intelligenceReport?.primaryCompanyAnalysis && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">STEP 1: Primary Company Analysis</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Company</div>
                    <div className="text-lg font-bold text-gray-900">{analysis.intelligenceReport.primaryCompanyAnalysis.companyName}</div>
                    <div className="text-sm text-blue-600">{analysis.intelligenceReport.primaryCompanyAnalysis.ticker}</div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    analysis.intelligenceReport.primaryCompanyAnalysis.currentSentiment.sentiment === 'Positive' ? 'bg-green-50' :
                    analysis.intelligenceReport.primaryCompanyAnalysis.currentSentiment.sentiment === 'Negative' ? 'bg-red-50' : 'bg-yellow-50'
                  }`}>
                    <div className="text-sm text-gray-600">Current Sentiment</div>
                    <div className={`text-lg font-bold ${
                      analysis.intelligenceReport.primaryCompanyAnalysis.currentSentiment.sentiment === 'Positive' ? 'text-green-900' :
                      analysis.intelligenceReport.primaryCompanyAnalysis.currentSentiment.sentiment === 'Negative' ? 'text-red-900' : 'text-yellow-900'
                    }`}>
                      {analysis.intelligenceReport.primaryCompanyAnalysis.currentSentiment.sentiment}
                    </div>
                    <div className="text-sm text-gray-600">{analysis.intelligenceReport.primaryCompanyAnalysis.currentSentiment.percentage}%</div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    analysis.intelligenceReport.primaryCompanyAnalysis.expectedStockImpact.includes('Positive') ? 'bg-green-50' :
                    analysis.intelligenceReport.primaryCompanyAnalysis.expectedStockImpact.includes('Negative') ? 'bg-red-50' : 'bg-gray-50'
                  }`}>
                    <div className="text-sm text-gray-600">Expected Stock Impact</div>
                    <div className={`text-lg font-bold ${
                      analysis.intelligenceReport.primaryCompanyAnalysis.expectedStockImpact.includes('Positive') ? 'text-green-900' :
                      analysis.intelligenceReport.primaryCompanyAnalysis.expectedStockImpact.includes('Negative') ? 'text-red-900' : 'text-gray-900'
                    }`}>
                      {analysis.intelligenceReport.primaryCompanyAnalysis.expectedStockImpact}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-600">Confidence Level</div>
                    <div className="text-lg font-bold text-blue-900">{analysis.intelligenceReport.primaryCompanyAnalysis.confidenceLevel}%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Connected Companies */}
          {activeTab === 'step2' && analysis.intelligenceReport?.connectedCompanies && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">STEP 2: Connected Companies (3-5 related companies)</h3>
                </div>
                
                <div className="space-y-4">
                  {analysis.intelligenceReport.connectedCompanies.map((company, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div>
                          <div className="font-semibold text-gray-900">{company.companyName}</div>
                          <div className="text-sm text-blue-600">{company.ticker}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-600">Relationship Type</div>
                          <div className="font-medium text-gray-900">{company.relationshipType}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-600">Expected Impact</div>
                          <div className={`font-medium ${
                            company.expectedImpact === 'Positive' ? 'text-green-600' :
                            company.expectedImpact === 'Negative' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {company.expectedImpact}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-600">Impact Strength</div>
                          <div className="font-bold text-lg text-blue-600">{company.impactStrength}/10</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Market Opportunities */}
          {activeTab === 'step3' && analysis.intelligenceReport?.marketOpportunities && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">STEP 3: Market Opportunities</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* BUY Recommendations */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Top 2 BUY Recommendations
                    </h4>
                    <div className="space-y-3">
                      {analysis.intelligenceReport.marketOpportunities.buyRecommendations.map((rec, index) => (
                        <div key={index} className="bg-white p-3 rounded border">
                          <div className="font-medium text-gray-900">{rec.company} ({rec.ticker})</div>
                          <div className="text-sm text-gray-600 mt-1">{rec.reasoning}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* AVOID Recommendation */}
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Top 1 AVOID Recommendation
                    </h4>
                    <div className="bg-white p-3 rounded border">
                      <div className="font-medium text-gray-900">
                        {analysis.intelligenceReport.marketOpportunities.avoidRecommendation.company} 
                        ({analysis.intelligenceReport.marketOpportunities.avoidRecommendation.ticker})
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {analysis.intelligenceReport.marketOpportunities.avoidRecommendation.reasoning}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-lg">
                    <div className="text-sm text-blue-600">Overall Market Outlook:</div>
                    <div className={`font-bold ${
                      analysis.intelligenceReport.marketOpportunities.overallMarketOutlook === 'Bullish' ? 'text-green-600' :
                      analysis.intelligenceReport.marketOpportunities.overallMarketOutlook === 'Bearish' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {analysis.intelligenceReport.marketOpportunities.overallMarketOutlook}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Investment Summary */}
          {activeTab === 'step4' && analysis.intelligenceReport?.investmentSummary && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">STEP 4: Investment Summary</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Best Opportunity */}
                   <div className="bg-green-50 p-6 rounded-lg">
                     <h4 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                       <Star className="h-5 w-5" />
                       Best Opportunity
                     </h4>
                    <div className="space-y-2">
                      <div className="font-bold text-lg text-gray-900">
                        {analysis.intelligenceReport.investmentSummary.bestOpportunity.company} 
                        ({analysis.intelligenceReport.investmentSummary.bestOpportunity.ticker})
                      </div>
                      <div className="text-gray-700">
                        <strong>Why:</strong> {analysis.intelligenceReport.investmentSummary.bestOpportunity.reasoning}
                      </div>
                    </div>
                  </div>
                  
                  {/* Biggest Risk */}
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Biggest Risk
                    </h4>
                    <div className="space-y-2">
                      <div className="font-bold text-lg text-gray-900">
                        {analysis.intelligenceReport.investmentSummary.biggestRisk.company} 
                        ({analysis.intelligenceReport.investmentSummary.biggestRisk.ticker})
                      </div>
                      <div className="text-gray-700">
                        <strong>Why:</strong> {analysis.intelligenceReport.investmentSummary.biggestRisk.reasoning}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                   <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-100 rounded-lg">
                     <Clock className="h-5 w-5 text-blue-600" />
                     <div className="text-sm text-blue-600">Investment Timeline:</div>
                     <div className="font-bold text-blue-900">
                       {analysis.intelligenceReport.investmentSummary.timeline}
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              {analysis.intelligenceReport?.detailedRecommendations?.map((rec: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        RANK {rec.rank || 'N/A'}: {rec.company || 'N/A'} - {rec.action || 'N/A'}
                      </h3>
                      <div className="text-sm text-gray-600 mt-1">
                        Confidence Score: {rec.confidenceScore || 'N/A'}%
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded font-medium ${getRecommendationColor(rec.action || 'HOLD')}`}>
                      {rec.action || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Analysis Summary</h4>
                      <p className="text-gray-700 mb-2">{rec.rippleRationale || 'No rationale provided'}</p>
                      <p className="text-gray-700">{rec.realityGap || 'No reality gap analysis'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Risk Management</h4>
                      <div className="space-y-1 text-gray-700">
                        <div>Stop Loss: ${rec.riskManagement?.stopLoss || 'N/A'}</div>
                        <div>Profit Target: ${rec.riskManagement?.profitTarget || 'N/A'}</div>
                        <div>Timeline: {rec.riskManagement?.timeline || 'N/A'}</div>
                        <div>Position Size: {rec.positionSizing || 'N/A'}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  No recommendations available
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FinancialIntelligence;