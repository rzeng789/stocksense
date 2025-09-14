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

// Interfaces for AI Stock Analysis
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
    connectedCompanies: {
      companyName: string;
      ticker: string;
      relationshipType: 'Supplier' | 'Customer' | 'Competitor' | 'Partner';
      expectedImpact: 'Positive' | 'Negative' | 'Neutral';
      impactStrength: number;
    }[];
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

interface AIStockAnalysisEngineProps {
  input: string;
  onAnalyze: (input: string) => void;
  isLoading: boolean;
  analysis: FinancialIntelligenceResponse | null;
}

const AIStockAnalysisEngine: React.FC<AIStockAnalysisEngineProps> = ({
  input,
  onAnalyze,
  isLoading,
  analysis
}) => {
  const [activeSubTab, setActiveSubTab] = useState('step1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAnalyze(input);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="h-8 w-8 text-purple-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">AI Stock Analysis & Correlation Engine</h2>
          <p className="text-gray-300">Advanced AI-powered analysis of news impact on stock markets</p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="news-input" className="block text-sm font-medium text-gray-300 mb-2">
              News Headline or Article Summary
            </label>
            <textarea
              id="news-input"
              value={input}
              onChange={(e) => onAnalyze(e.target.value)}
              placeholder="Enter a news headline or article summary to analyze its potential impact on stock markets..."
              className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-gray-700 text-white placeholder-gray-400"
              rows={4}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Analyzing Market Impact...
              </>
            ) : (
              <>
                <BarChart3 className="h-5 w-5" />
                Analyze Market Impact
              </>
            )}
          </button>
        </div>
      </form>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Sub-navigation */}
          <div className="border-b border-gray-600">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveSubTab('step1')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeSubTab === 'step1'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                }`}
              >
                Primary Analysis
              </button>
              <button
                onClick={() => setActiveSubTab('step2')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeSubTab === 'step2'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                }`}
              >
                Connected Companies
              </button>
              <button
                onClick={() => setActiveSubTab('step3')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeSubTab === 'step3'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                }`}
              >
                Market Opportunities
              </button>
              <button
                onClick={() => setActiveSubTab('step4')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeSubTab === 'step4'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                }`}
              >
                Investment Summary
              </button>
              <button
                onClick={() => setActiveSubTab('ripple')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeSubTab === 'ripple'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                }`}
              >
                Ripple Effects
              </button>
            </nav>
          </div>

          {/* STEP 1: Primary Company Analysis */}
          {activeSubTab === 'step1' && analysis.intelligenceReport?.primaryCompanyAnalysis && (
            <div className="space-y-6">
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="h-6 w-6 text-purple-400" />
                  <h3 className="text-xl font-semibold text-white">STEP 1: Primary Company Analysis</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Company Info */}
                  <div className="bg-purple-900 p-6 rounded-lg">
                    <h4 className="font-semibold text-white mb-4">Company Information</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-purple-300">Company Name</div>
                        <div className="font-bold text-lg text-white">
                          {analysis.intelligenceReport.primaryCompanyAnalysis.companyName}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-purple-300">Ticker Symbol</div>
                        <div className="font-bold text-lg text-purple-400">
                          {analysis.intelligenceReport.primaryCompanyAnalysis.ticker}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sentiment Analysis */}
                  <div className="bg-green-900 p-6 rounded-lg">
                    <h4 className="font-semibold text-white mb-4">Current Sentiment</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-green-300">Sentiment</div>
                        <div className={`font-bold text-lg ${
                          analysis.intelligenceReport.primaryCompanyAnalysis.currentSentiment.sentiment === 'Positive' ? 'text-green-400' :
                          analysis.intelligenceReport.primaryCompanyAnalysis.currentSentiment.sentiment === 'Negative' ? 'text-red-400' : 'text-gray-300'
                        }`}>
                          {analysis.intelligenceReport.primaryCompanyAnalysis.currentSentiment.sentiment}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-green-300">Confidence</div>
                        <div className="font-bold text-lg text-white">
                          {analysis.intelligenceReport.primaryCompanyAnalysis.currentSentiment.percentage}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stock Impact */}
                  <div className="bg-blue-900 p-6 rounded-lg">
                    <h4 className="font-semibold text-white mb-4">Expected Stock Impact</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-blue-300">Impact Level</div>
                        <div className={`font-bold text-lg ${
                          analysis.intelligenceReport.primaryCompanyAnalysis.expectedStockImpact.includes('Positive') ? 'text-green-400' :
                          analysis.intelligenceReport.primaryCompanyAnalysis.expectedStockImpact.includes('Negative') ? 'text-red-400' : 'text-gray-300'
                        }`}>
                          {analysis.intelligenceReport.primaryCompanyAnalysis.expectedStockImpact}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-blue-300">Confidence Level</div>
                        <div className="font-bold text-lg text-white">
                          {analysis.intelligenceReport.primaryCompanyAnalysis.confidenceLevel}/10
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Connected Companies */}
          {activeSubTab === 'step2' && analysis.intelligenceReport?.connectedCompanies && (
            <div className="space-y-6">
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="h-6 w-6 text-purple-400" />
                  <h3 className="text-xl font-semibold text-white">STEP 2: Connected Companies Analysis</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {analysis.intelligenceReport.connectedCompanies.map((company: any, index: number) => (
                    <div key={index} className="border border-gray-600 bg-gray-600 rounded-lg p-4 hover:bg-gray-500 transition-colors">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-300">Company</div>
                          <div className="font-bold text-white">{company.companyName}</div>
                          <div className="text-sm text-purple-400">{company.ticker}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-300">Relationship Type</div>
                          <div className="font-medium text-white">{company.relationshipType}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-300">Expected Impact</div>
                          <div className={`font-medium ${
                            company.expectedImpact === 'Positive' ? 'text-green-400' :
                            company.expectedImpact === 'Negative' ? 'text-red-400' : 'text-gray-300'
                          }`}>
                            {company.expectedImpact}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-300">Impact Strength</div>
                          <div className="font-bold text-lg text-purple-400">{company.impactStrength}/10</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Market Opportunities */}
          {activeSubTab === 'step3' && analysis.intelligenceReport?.marketOpportunities && (
            <div className="space-y-6">
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="h-6 w-6 text-purple-400" />
                  <h3 className="text-xl font-semibold text-white">STEP 3: Market Opportunities</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* BUY Recommendations */}
                  <div className="bg-green-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Top 2 BUY Recommendations
                    </h4>
                    <div className="space-y-3">
                      {analysis.intelligenceReport.marketOpportunities.buyRecommendations.map((rec: any, index: number) => (
                        <div key={index} className="bg-gray-600 p-3 rounded border border-gray-500">
                          <div className="font-medium text-white">{rec.company} ({rec.ticker})</div>
                          <div className="text-sm text-gray-300 mt-1">{rec.reasoning}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* AVOID Recommendation */}
                  <div className="bg-red-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Top 1 AVOID Recommendation
                    </h4>
                    <div className="bg-gray-600 p-3 rounded border border-gray-500">
                      <div className="font-medium text-white">
                        {analysis.intelligenceReport.marketOpportunities.avoidRecommendation.company} 
                        ({analysis.intelligenceReport.marketOpportunities.avoidRecommendation.ticker})
                      </div>
                      <div className="text-sm text-gray-300 mt-1">
                        {analysis.intelligenceReport.marketOpportunities.avoidRecommendation.reasoning}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 rounded-lg">
                    <div className="text-sm text-purple-300">Overall Market Outlook:</div>
                    <div className={`font-bold ${
                      analysis.intelligenceReport.marketOpportunities.overallMarketOutlook === 'Bullish' ? 'text-green-400' :
                      analysis.intelligenceReport.marketOpportunities.overallMarketOutlook === 'Bearish' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {analysis.intelligenceReport.marketOpportunities.overallMarketOutlook}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Investment Summary */}
          {activeSubTab === 'step4' && analysis.intelligenceReport?.investmentSummary && (
            <div className="space-y-6">
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                  <h3 className="text-xl font-semibold text-white">STEP 4: Investment Summary</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Best Opportunity */}
                   <div className="bg-green-900 p-6 rounded-lg">
                     <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                       <Star className="h-5 w-5" />
                       Best Opportunity
                     </h4>
                    <div className="space-y-2">
                      <div className="font-bold text-lg text-white">
                        {analysis.intelligenceReport.investmentSummary.bestOpportunity.company} 
                        ({analysis.intelligenceReport.investmentSummary.bestOpportunity.ticker})
                      </div>
                      <div className="text-green-200">
                        <strong>Why:</strong> {analysis.intelligenceReport.investmentSummary.bestOpportunity.reasoning}
                      </div>
                    </div>
                  </div>
                  
                  {/* Biggest Risk */}
                  <div className="bg-red-900 p-6 rounded-lg">
                    <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Biggest Risk
                    </h4>
                    <div className="space-y-2">
                      <div className="font-bold text-lg text-white">
                        {analysis.intelligenceReport.investmentSummary.biggestRisk.company} 
                        ({analysis.intelligenceReport.investmentSummary.biggestRisk.ticker})
                      </div>
                      <div className="text-red-200">
                        <strong>Why:</strong> {analysis.intelligenceReport.investmentSummary.biggestRisk.reasoning}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                   <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 rounded-lg">
                     <Clock className="h-5 w-5 text-purple-400" />
                     <div className="text-sm text-purple-300">Investment Timeline:</div>
                     <div className="font-bold text-white">
                       {analysis.intelligenceReport.investmentSummary.timeline}
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          )}

          {/* Ripple Effects Tab */}
          {activeSubTab === 'ripple' && analysis.rippleEffects && (
            <div className="space-y-6">
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="h-6 w-6 text-purple-400" />
                  <h3 className="text-xl font-semibold text-white">Ripple Effect Analysis</h3>
                </div>
                
                {analysis.rippleEffects.map((effect: any, categoryIndex: number) => (
                  <div key={categoryIndex} className="mb-8">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-400" />
                      {effect.category} Companies
                    </h4>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {effect.companies.map((company: any, companyIndex: number) => (
                        <div key={companyIndex} className="border border-gray-600 bg-gray-600 rounded-lg p-4 hover:bg-gray-500 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h5 className="font-semibold text-white">{company.companyName}</h5>
                              <div className="text-sm text-purple-400">{company.ticker}</div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              company.investmentGrade.recommendation === 'BUY' ? 'bg-green-700 text-green-200' :
                              company.investmentGrade.recommendation === 'SELL' ? 'bg-red-700 text-red-200' :
                              'bg-yellow-700 text-yellow-200'
                            }`}>
                              {company.investmentGrade.recommendation}
                            </span>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-300">Relationship:</span>
                              <span className="font-medium text-white">{company.relationship}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-gray-300">Impact:</span>
                              <span className={`font-medium flex items-center gap-1 ${
                                company.expectedImpact.direction === '+' ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {company.expectedImpact.direction === '+' ? 
                                  <TrendingUp className="h-3 w-3" /> : 
                                  <TrendingDown className="h-3 w-3" />
                                }
                                {company.expectedImpact.magnitude}/10
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-gray-300">Timeline:</span>
                              <span className="font-medium text-white">{company.expectedImpact.timeline}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-gray-300">Current Price:</span>
                              <span className="font-medium text-white">${company.currentMetrics.price.toFixed(2)}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-gray-300">P/E Ratio:</span>
                              <span className="font-medium text-white">{company.currentMetrics.peRatio.toFixed(1)}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-gray-300">News Mentions:</span>
                              <span className="font-medium text-white">{company.newsMentions}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-500">
                            <p className="text-xs text-gray-300">
                              <strong>Reasoning:</strong> {company.investmentGrade.reasoning}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Reality vs Sentiment Analysis */}
                {analysis.realityVsSentiment && (
                  <div className="mt-8 bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Eye className="h-5 w-5 text-purple-400" />
                      Reality vs Sentiment Gap Analysis
                    </h4>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-gray-600 p-4 rounded-lg">
                          <h5 className="font-medium text-white mb-2">Sentiment Metrics</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-300">Sentiment Intensity:</span>
                              <span className="font-medium text-white">{(analysis.realityVsSentiment.sentimentIntensity * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">Fundamental Justification:</span>
                              <span className={`font-medium ${
                                analysis.realityVsSentiment.fundamentalJustification ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {analysis.realityVsSentiment.fundamentalJustification ? 'Yes' : 'No'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">Value Disconnect Score:</span>
                              <span className={`font-medium ${
                                analysis.realityVsSentiment.valueDisconnectScore > 0 ? 'text-red-400' : 'text-green-400'
                              }`}>
                                {analysis.realityVsSentiment.valueDisconnectScore.toFixed(1)}/10
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-600 p-4 rounded-lg">
                          <h5 className="font-medium text-white mb-2">Historical Context</h5>
                          <p className="text-sm text-gray-300">{analysis.realityVsSentiment.historicalPrecedent}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {analysis.realityVsSentiment.realityGapAssessment?.overreactionOpportunities?.length > 0 && (
                          <div className="bg-green-900 p-4 rounded-lg">
                            <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              Overreaction Opportunities
                            </h5>
                            <ul className="text-sm text-green-200 space-y-1">
                              {analysis.realityVsSentiment.realityGapAssessment.overreactionOpportunities.map((opp: string, index: number) => (
                                <li key={index}>• {opp}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {analysis.realityVsSentiment.realityGapAssessment?.underreactionAlerts?.length > 0 && (
                          <div className="bg-red-900 p-4 rounded-lg">
                            <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              Underreaction Alerts
                            </h5>
                            <ul className="text-sm text-red-200 space-y-1">
                              {analysis.realityVsSentiment.realityGapAssessment.underreactionAlerts.map((alert: string, index: number) => (
                                <li key={index}>• {alert}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIStockAnalysisEngine;