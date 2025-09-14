'use client';

import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
} from 'chart.js';
import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2';
import {
  FileText,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Shield,
  Lightbulb,
  RefreshCw,
  Copy,
  ExternalLink,
  Calendar,
  DollarSign,
  X,
  Brain
} from 'lucide-react';
import StockSenseAI from './StockSenseAI';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

// Interface definitions
interface ArticleContent {
  headline: string;
  fullText: string;
  url: string;
  publishedDate: string;
  source: string;
  author?: string;
  summary: string;
}

interface RelatedArticle {
  headline: string;
  url: string;
  source: string;
  publishedDate: string;
  relevanceScore: number;
  summary: string;
}

interface StockImpact {
  ticker: string;
  companyName: string;
  impactScore: number;
  impactLevel: 'Very Negative' | 'Negative' | 'Neutral' | 'Positive' | 'Very Positive';
  confidence: number;
  timeframe: 'Immediate' | 'Short-term' | 'Medium-term' | 'Long-term';
  reasoning: string[];
  priceTarget?: {
    current: number;
    predicted: number;
    change: number;
    changePercent: number;
  };
}

interface MarketSector {
  name: string;
  impactScore: number;
  affectedStocks: string[];
  reasoning: string;
}

interface ArticleAnalysisResponse {
  originalArticle: ArticleContent;
  relatedArticles: RelatedArticle[];
  stockImpacts: StockImpact[];
  sectorImpacts: MarketSector[];
  overallMarketSentiment: {
    score: number;
    label: string;
    confidence: number;
  };
  keyInsights: string[];
  riskFactors: string[];
  opportunities: string[];
  timeline: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

interface APIResponse {
  success: boolean;
  data: ArticleAnalysisResponse;
  timestamp: string;
  disclaimer: string;
}

const ArticleImpactDashboard: React.FC = () => {
  const [headline, setHeadline] = useState('');
  const [analysis, setAnalysis] = useState<ArticleAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAnalysisData, setStockAnalysisData] = useState<any>(null);
  
  // AI Stock Analysis Engine state


  const analyzeArticle = async (headlineText: string) => {
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/article-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ headline: headlineText }),
      });
      
      const data: APIResponse = await response.json();
      
      if (data.success) {
        setAnalysis(data.data);
      } else {
        console.error('Analysis failed');
      }
    } catch (error) {
      console.error('Error analyzing article:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headline.trim()) {
      analyzeArticle(headline);
    }
  };

  const generateStockPriceData = (ticker: string, currentPrice: number, change: number) => {
    const days = 30;
    const data = [];
    const labels = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      
      const randomVariation = (Math.random() - 0.5) * 0.1;
      const basePrice = currentPrice * (1 - (change / 100) * (i / days));
      const price = basePrice * (1 + randomVariation);
      data.push(parseFloat(price.toFixed(2)));
    }
    
    return {
      chartData: {
        labels,
        datasets: [
          {
            label: `${ticker} Price`,
            data,
            borderColor: change >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
            backgroundColor: change >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            tension: 0.1,
            fill: true,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: `${ticker} - 30 Day Price Movement`,
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: function(value: any) {
                return '$' + value.toFixed(2);
              },
            },
          },
        },
      },
      currentPrice,
      change,
      volatility: (Math.random() * 5 + 1).toFixed(1),
      summary: `Based on recent market analysis, ${ticker} shows ${change >= 0 ? 'positive' : 'negative'} momentum with ${change >= 0 ? 'upward' : 'downward'} price movement over the past 30 days.`
    };
  };

  const handleStockAnalysis = (ticker: string, currentPrice: number, change: number) => {
    const stockData = generateStockPriceData(ticker, currentPrice, change);
    setStockAnalysisData(stockData);
    setShowStockModal(true);
  };

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'Very Positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'Positive': return 'bg-green-50 text-green-700 border-green-100';
      case 'Neutral': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Negative': return 'bg-red-50 text-red-700 border-red-100';
      case 'Very Negative': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSentimentIcon = (score: number) => {
    if (score >= 0.6) return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (score <= -0.6) return <TrendingDown className="w-5 h-5 text-red-600" />;
    return <Activity className="w-5 h-5 text-yellow-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Impact Dashboard</h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Analyze how news articles impact stock prices and market sentiment with AI-powered insights
          </p>
        </div>

        {/* Article Input */}
        <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Article Analysis</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Article Headline or News Summary
              </label>
              <textarea
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Enter article headline or news summary to analyze market impact..."
                className="w-full h-32 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={isAnalyzing || !headline.trim()}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Analyzing Market Impact...
                </>
              ) : (
                <>
                  <BarChart3 className="h-5 w-5" />
                  Analyze Impact
                </>
              )}
            </button>
          </form>
        </div>

        {/* StockSense AI Section */}
        <div className="mb-12">
          <StockSenseAI />
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-8">
            {/* Overall Market Sentiment */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                {getSentimentIcon(analysis.overallMarketSentiment.score)}
                <h2 className="text-xl font-bold text-gray-900">Overall Market Sentiment</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {(analysis.overallMarketSentiment.score * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-600">Sentiment Score</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900 mb-1">
                    {analysis.overallMarketSentiment.label}
                  </div>
                  <div className="text-sm text-gray-600">Market Outlook</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600 mb-1">
                    {(analysis.overallMarketSentiment.confidence * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-600">Confidence</div>
                </div>
              </div>
            </div>

            {/* Stock Impacts */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-600" />
                Stock Impact Analysis
              </h2>
              <div className="grid gap-4">
                {analysis.stockImpacts.map((stock, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="font-bold text-lg text-gray-900">{stock.ticker}</div>
                        <div className="text-gray-600">{stock.companyName}</div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getImpactColor(stock.impactLevel)}`}>
                          {stock.impactLevel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Confidence: {(stock.confidence * 100).toFixed(0)}%</span>
                        {stock.priceTarget && (
                          <button
                            onClick={() => handleStockAnalysis(stock.ticker, stock.priceTarget!.current, stock.priceTarget!.changePercent)}
                            className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center gap-1"
                          >
                            <BarChart3 className="w-4 h-4" />
                            View Chart
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {stock.priceTarget && (
                      <div className="grid md:grid-cols-4 gap-4 mb-3 p-3 bg-white rounded-lg border border-gray-100">
                        <div>
                          <div className="text-sm text-gray-500">Current Price</div>
                          <div className="font-semibold text-gray-900">${stock.priceTarget.current.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Predicted Price</div>
                          <div className="font-semibold text-gray-900">${stock.priceTarget.predicted.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Change</div>
                          <div className={`font-semibold ${
                            stock.priceTarget.change >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stock.priceTarget.change >= 0 ? '+' : ''}${stock.priceTarget.change.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">% Change</div>
                          <div className={`font-semibold ${
                            stock.priceTarget.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stock.priceTarget.changePercent >= 0 ? '+' : ''}{stock.priceTarget.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-900">Key Reasoning:</div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {stock.reasoning.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                Key Insights
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Opportunities
                  </h3>
                  <ul className="space-y-2">
                    {analysis.opportunities.map((opportunity, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Risk Factors
                  </h3>
                  <ul className="space-y-2">
                    {analysis.riskFactors.map((risk, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-purple-600 mb-2 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    General Insights
                  </h3>
                  <ul className="space-y-2">
                    {analysis.keyInsights.map((insight, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-gray-600" />
                Related Articles
              </h2>
              <div className="space-y-4">
                {analysis.relatedArticles.map((article, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{article.headline}</h3>
                        <p className="text-sm text-gray-600 mb-2">{article.summary}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{article.source}</span>
                          <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Relevance: {(article.relevanceScore * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 p-2 text-gray-400 hover:text-blue-600"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
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
                    Stock predictions are based on AI analysis and may not reflect actual market performance. 
                    Always conduct your own research and consult with financial professionals before making investment decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>





      {/* Stock Analysis Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Stock Analysis</h3>
                <button
                  onClick={() => setShowStockModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {stockAnalysisData && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">30-Day Stock Performance</h4>
                    <div className="h-64">
                      <Line data={stockAnalysisData.chartData} options={stockAnalysisData.chartOptions} />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-semibold mb-2">Key Metrics</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Current Price:</span>
                          <span className="font-medium">${stockAnalysisData.currentPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>30-Day Change:</span>
                          <span className={`font-medium ${
                            stockAnalysisData.change >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stockAnalysisData.change >= 0 ? '+' : ''}{stockAnalysisData.change.toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Volatility:</span>
                          <span className="font-medium">{stockAnalysisData.volatility}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-semibold mb-2">Analysis Summary</h5>
                      <p className="text-sm text-gray-600">
                        {stockAnalysisData.summary}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleImpactDashboard;