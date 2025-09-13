'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Brain, BarChart3, Lightbulb, Shield, RefreshCw, Search } from 'lucide-react';

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

interface APIResponse {
  success: boolean;
  data: AnalysisResponse;
  timestamp: string;
  disclaimer: string;
}

const AIStockAnalysis: React.FC = () => {
  const [ticker, setTicker] = useState('AAPL');
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async (symbol: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/stock-analysis?ticker=${symbol}&analysis=true`);
      const data: APIResponse = await response.json();
      
      if (data.success) {
        setAnalysis(data.data);
      } else {
        setError('Failed to fetch analysis data');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Analysis fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis(ticker);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      fetchAnalysis(ticker.toUpperCase());
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'correlation': return <BarChart3 className="w-5 h-5" />;
      case 'sector': return <Target className="w-5 h-5" />;
      case 'sentiment': return <TrendingUp className="w-5 h-5" />;
      case 'risk': return <AlertTriangle className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'correlation': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'sector': return 'bg-green-50 border-green-200 text-green-800';
      case 'sentiment': return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'risk': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCorrelationColor = (strength: string) => {
    switch (strength) {
      case 'Strong': return 'text-red-600 bg-red-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      case 'Weak': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            AI Stock Analysis & Correlation Engine
          </h1>
        </div>
        <p className="text-gray-600 mb-6">
          Advanced AI-powered stock analysis with correlation insights and risk assessment
        </p>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="Enter stock ticker (e.g., AAPL, MSFT)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Brain className="w-5 h-5" />
            )}
            Analyze
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Analyzing stock data and correlations...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 font-medium">Error</p>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && !loading && (
        <div className="space-y-8">
          {/* Primary Stock Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Analysis for {analysis.primaryStock}
            </h2>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(analysis.riskAssessment.level)}`}>
                {analysis.riskAssessment.level} Risk
              </span>
              <span className="text-gray-600">
                {analysis.correlations.length} correlated stocks identified
              </span>
            </div>
          </div>

          {/* AI Insights */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              AI-Generated Insights
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {analysis.insights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${getInsightColor(insight.type)}`}
                >
                  <div className="flex items-start gap-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{insight.title}</h4>
                      <p className="text-sm mb-3">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">
                          Confidence: {(insight.confidence * 100).toFixed(0)}%
                        </span>
                        {insight.actionable && (
                          <span className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded">
                            Actionable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Correlation Analysis */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              Stock Correlations
            </h3>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Related Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Correlation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Strength
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Implication
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analysis.correlations.map((corr, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{corr.symbol2}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {corr.correlation.toFixed(3)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCorrelationColor(corr.strength)}`}>
                            {corr.strength}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {corr.correlation > 0.7 ? 'Moves together strongly' :
                           corr.correlation > 0.5 ? 'Moderate co-movement' :
                           'Limited correlation'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-red-500" />
              Risk Assessment
            </h3>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-4 py-2 rounded-lg text-lg font-semibold ${getRiskColor(analysis.riskAssessment.level)}`}>
                  {analysis.riskAssessment.level} Risk Level
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Risk Factors:</h4>
                <ul className="space-y-1">
                  {analysis.riskAssessment.factors.map((factor, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-green-500" />
              AI Recommendations
            </h3>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6">
              <ul className="space-y-3">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700">{rec}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">Important Disclaimer</h4>
                <p className="text-yellow-700 text-sm">
                  This analysis is for educational purposes only and should not be considered as financial advice. 
                  Always conduct your own research and consult with financial professionals before making investment decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIStockAnalysis;