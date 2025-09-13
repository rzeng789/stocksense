'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Minus, ExternalLink, AlertCircle } from 'lucide-react';

interface SentimentData {
  ticker: string;
  relevance_score: string;
  ticker_sentiment_score: string;
  ticker_sentiment_label: string;
}

interface NewsItem {
  title: string;
  url: string;
  time_published: string;
  authors: string[];
  summary: string;
  banner_image: string;
  source: string;
  category_within_source: string;
  source_domain: string;
  topics: Array<{
    topic: string;
    relevance_score: string;
  }>;
  overall_sentiment_score: number;
  overall_sentiment_label: string;
  ticker_sentiment: SentimentData[];
}

interface ApiResponse {
  items?: string;
  sentiment_score_definition?: string;
  relevance_score_definition?: string;
  feed: NewsItem[];
  mockData?: boolean;
  error?: string;
}

const StockSentiment = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTickers, setSelectedTickers] = useState('AAPL,GOOGL,MSFT,TSLA');

  const fetchSentimentData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/stock-sentiment?tickers=${selectedTickers}&limit=10`);
      const result = await response.json();
      
      if (!response.ok && !result.mockData) {
        throw new Error(result.error || 'Failed to fetch data');
      }
      
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentimentData();
  }, []);

  const getSentimentIcon = (label: string) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('bullish')) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (lowerLabel.includes('bearish')) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    } else {
      return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSentimentColor = (label: string) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('bullish')) {
      return 'text-green-600 bg-green-50 border-green-200';
    } else if (lowerLabel.includes('bearish')) {
      return 'text-red-600 bg-red-50 border-red-200';
    } else {
      return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      // Parse the date format: 20241201T120000
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      const hour = dateString.substring(9, 11);
      const minute = dateString.substring(11, 13);
      
      const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Stock Sentiment Analysis
        </h1>
        <p className="text-gray-600 mb-6">
          Real-time stock sentiment analysis and news feed powered by Alpha Vantage API
        </p>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="tickers" className="block text-sm font-medium text-gray-700 mb-2">
              Stock Tickers (comma-separated)
            </label>
            <input
              id="tickers"
              type="text"
              value={selectedTickers}
              onChange={(e) => setSelectedTickers(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="AAPL,GOOGL,MSFT,TSLA"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchSentimentData}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* API Info */}
        {data?.mockData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-yellow-800">
                <strong>Demo Mode:</strong> Showing mock data. Get your free API key from{' '}
                <a 
                  href="https://www.alphavantage.co/support/#api-key" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Alpha Vantage
                </a>{' '}
                and add it to your .env.local file for real data.
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Sentiment Definitions */}
          {data.sentiment_score_definition && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Sentiment Score Definition</h3>
              <p className="text-blue-800 text-sm">{data.sentiment_score_definition}</p>
            </div>
          )}

          {/* News Feed */}
          <div className="grid gap-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Latest News & Sentiment ({data.feed?.length || 0} articles)
            </h2>
            
            {data.feed?.map((item, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 transition-colors flex items-center gap-2"
                        >
                          {item.title}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span>{item.source}</span>
                        <span>•</span>
                        <span>{formatDate(item.time_published)}</span>
                        <span>•</span>
                        <span>{item.authors?.join(', ') || 'Unknown Author'}</span>
                      </div>
                    </div>
                    
                    {/* Overall Sentiment */}
                    <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-2 ${getSentimentColor(item.overall_sentiment_label)}`}>
                      {getSentimentIcon(item.overall_sentiment_label)}
                      {item.overall_sentiment_label}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{item.summary}</p>
                  
                  {/* Ticker Sentiments */}
                  {item.ticker_sentiment && item.ticker_sentiment.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">Ticker Sentiment Analysis</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {item.ticker_sentiment.map((sentiment, sentIndex) => (
                          <div key={sentIndex} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-gray-900">{sentiment.ticker}</span>
                              <div className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getSentimentColor(sentiment.ticker_sentiment_label)}`}>
                                {getSentimentIcon(sentiment.ticker_sentiment_label)}
                                {sentiment.ticker_sentiment_label}
                              </div>
                            </div>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>Score: {parseFloat(sentiment.ticker_sentiment_score).toFixed(3)}</div>
                              <div>Relevance: {parseFloat(sentiment.relevance_score).toFixed(3)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Topics */}
                  {item.topics && item.topics.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Topics</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.topics.map((topic, topicIndex) => (
                          <span key={topicIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {topic.topic} ({parseFloat(topic.relevance_score).toFixed(2)})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StockSentiment;