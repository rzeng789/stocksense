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

const IndividualStockAnalysis: React.FC = () => {
  const [ticker, setTicker] = useState('');
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
    <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">
            Individual Stock Analysis
          </h1>
        </div>
        <p className="text-gray-300 mb-6">
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
                className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-gray-300">Analyzing stock data and correlations...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="text-red-200 font-medium">Error</p>
          </div>
          <p className="text-red-300 mt-1">{error}</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && !loading && (
        <div className="space-y-8">
          {/* Primary Stock Info */}
          <div className="bg-gradient-to-r from-purple-900 to-purple-800 rounded-xl p-6 border border-purple-700">
            <h2 className="text-2xl font-bold text-white mb-2">
              Analysis for {analysis.primaryStock}
            </h2>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(analysis.riskAssessment.level)}`}>
                {analysis.riskAssessment.level} Risk
              </span>
              <span className="text-gray-300">
                {analysis.correlations.length} correlated stocks identified
              </span>
            </div>
          </div>

          {/* Correlations */}
          {analysis.correlations.length > 0 && (
            <div className="bg-gray-700 border border-gray-600 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                Stock Correlations
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.correlations.map((corr, index) => (
                  <div key={index} className="bg-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">
                        {corr.symbol1} ↔ {corr.symbol2}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCorrelationColor(corr.strength)}`}>
                        {corr.strength}
                      </span>
                    </div>
                    <div className="text-sm text-gray-300">
                      Correlation: {(corr.correlation * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Insights */}
          {analysis.insights.length > 0 && (
            <div className="bg-gray-700 border border-gray-600 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                AI Insights
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {analysis.insights.map((insight, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getInsightColor(insight.type)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {getInsightIcon(insight.type)}
                      <h4 className="font-semibold">{insight.title}</h4>
                      {insight.actionable && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Actionable
                        </span>
                      )}
                    </div>
                    <p className="text-sm mb-2">{insight.description}</p>
                    <div className="text-xs opacity-75">
                      Confidence: {(insight.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Assessment */}
          <div className="bg-gray-700 border border-gray-600 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-red-400" />
              Risk Assessment
            </h3>
            <div className="mb-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getRiskColor(analysis.riskAssessment.level)}`}>
                {analysis.riskAssessment.level} Risk Level
              </span>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Risk Factors:</h4>
              <ul className="list-disc list-inside space-y-1">
                {analysis.riskAssessment.factors.map((factor, index) => (
                  <li key={index} className="text-gray-300 text-sm">{factor}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <div className="bg-gray-700 border border-gray-600 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-green-400" />
                Recommendations
              </h3>
              <div className="space-y-3">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-900 rounded-lg">
                    <div className="w-6 h-6 bg-green-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-200 text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-200">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IndividualStockAnalysis;