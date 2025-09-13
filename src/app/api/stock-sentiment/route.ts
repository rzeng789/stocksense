import { NextRequest, NextResponse } from 'next/server';

// Alpha Vantage API configuration
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';

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
  items: string;
  sentiment_score_definition: string;
  relevance_score_definition: string;
  feed: NewsItem[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tickers = searchParams.get('tickers') || 'AAPL,GOOGL,MSFT,TSLA';
    const limit = searchParams.get('limit') || '10';
    
    // Construct the API URL for news sentiment
    const apiUrl = `${BASE_URL}?function=NEWS_SENTIMENT&tickers=${tickers}&limit=${limit}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    
    console.log('Fetching from:', apiUrl.replace(ALPHA_VANTAGE_API_KEY, 'HIDDEN'));
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data: ApiResponse = await response.json();
    
    // Check if we hit rate limit or have an error
    if ('Error Message' in data || 'Note' in data) {
      return NextResponse.json(
        { 
          error: 'API rate limit exceeded or invalid request',
          message: (data as any)['Error Message'] || (data as any)['Note'],
          mockData: true,
          feed: getMockSentimentData()
        },
        { status: 429 }
      );
    }
    
    // Process and return the data
    const processedData = {
      items: data.items,
      sentiment_score_definition: data.sentiment_score_definition,
      relevance_score_definition: data.relevance_score_definition,
      feed: data.feed?.slice(0, parseInt(limit)) || [],
      mockData: false
    };
    
    return NextResponse.json(processedData);
    
  } catch (error) {
    console.error('Error fetching stock sentiment:', error);
    
    // Return mock data in case of error
    return NextResponse.json(
      {
        error: 'Failed to fetch real data, showing mock data',
        mockData: true,
        feed: getMockSentimentData()
      },
      { status: 500 }
    );
  }
}

// Mock data for demonstration when API is not available
function getMockSentimentData(): NewsItem[] {
  return [
    {
      title: "Apple Reports Strong Q4 Earnings, iPhone Sales Exceed Expectations",
      url: "https://example.com/apple-earnings",
      time_published: "20241201T120000",
      authors: ["John Smith"],
      summary: "Apple Inc. reported better-than-expected quarterly earnings driven by strong iPhone sales and services revenue growth.",
      banner_image: "https://example.com/apple-image.jpg",
      source: "Financial Times",
      category_within_source: "Technology",
      source_domain: "ft.com",
      topics: [
        {
          topic: "Earnings",
          relevance_score: "0.9"
        }
      ],
      overall_sentiment_score: 0.25,
      overall_sentiment_label: "Somewhat-Bullish",
      ticker_sentiment: [
        {
          ticker: "AAPL",
          relevance_score: "0.95",
          ticker_sentiment_score: "0.3",
          ticker_sentiment_label: "Bullish"
        }
      ]
    },
    {
      title: "Tesla Stock Rises on New Autopilot Features Announcement",
      url: "https://example.com/tesla-autopilot",
      time_published: "20241201T100000",
      authors: ["Jane Doe"],
      summary: "Tesla announces major updates to its Autopilot system, boosting investor confidence and stock price.",
      banner_image: "https://example.com/tesla-image.jpg",
      source: "Reuters",
      category_within_source: "Automotive",
      source_domain: "reuters.com",
      topics: [
        {
          topic: "Technology",
          relevance_score: "0.8"
        }
      ],
      overall_sentiment_score: 0.15,
      overall_sentiment_label: "Somewhat-Bullish",
      ticker_sentiment: [
        {
          ticker: "TSLA",
          relevance_score: "0.9",
          ticker_sentiment_score: "0.2",
          ticker_sentiment_label: "Bullish"
        }
      ]
    },
    {
      title: "Microsoft Azure Cloud Revenue Grows 30% Year-over-Year",
      url: "https://example.com/microsoft-azure",
      time_published: "20241130T150000",
      authors: ["Tech Reporter"],
      summary: "Microsoft's cloud computing division continues to show strong growth, outpacing competitors in the enterprise market.",
      banner_image: "https://example.com/microsoft-image.jpg",
      source: "TechCrunch",
      category_within_source: "Cloud Computing",
      source_domain: "techcrunch.com",
      topics: [
        {
          topic: "Cloud Computing",
          relevance_score: "0.85"
        }
      ],
      overall_sentiment_score: 0.2,
      overall_sentiment_label: "Bullish",
      ticker_sentiment: [
        {
          ticker: "MSFT",
          relevance_score: "0.88",
          ticker_sentiment_score: "0.25",
          ticker_sentiment_label: "Bullish"
        }
      ]
    }
  ];
}