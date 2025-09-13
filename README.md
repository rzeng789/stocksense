# StockSense - AI-Powered Stock Analysis Platform

A comprehensive web application that combines real-time stock sentiment analysis with advanced AI-powered correlation insights and risk assessment using Alpha Vantage's APIs and proprietary analysis algorithms.

## Features

### 🧠 AI Stock Analysis Engine
- **Advanced Correlation Analysis**: Identify related stocks and their correlation strengths
- **AI-Generated Insights**: Machine learning-powered market insights with confidence scores
- **Risk Assessment**: Comprehensive risk evaluation with actionable factors
- **Smart Recommendations**: AI-driven investment recommendations based on market data
- **Related Stock Discovery**: Find stocks that move together in the market

### 📈 Real-time Sentiment Analysis
- **Stock Sentiment Scoring**: Get sentiment scores for any stock ticker
- **Market News Feed**: Latest news articles with sentiment indicators
- **Multi-stock Analysis**: Compare sentiment across multiple stocks
- **Sentiment Trends**: Track how market sentiment changes over time

### 🎨 Modern User Experience
- **Intuitive Navigation**: Switch between AI analysis and sentiment views
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Interactive Components**: Real-time data updates and user-friendly interfaces
- **Mock Data Support**: Fallback to demo data when API limits are reached

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: Alpha Vantage Financial Data API
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Alpha Vantage API key (free tier available)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Get your free Alpha Vantage API key:
   - Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
   - Sign up for a free account
   - Copy your API key

3. Add your API key to `.env.local`:
```env
ALPHA_VANTAGE_API_KEY=your_actual_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

### GET /api/stock-analysis

Fetches comprehensive AI-powered stock analysis including correlations, insights, and risk assessment.

**Parameters:**
- `ticker` (string): Stock ticker symbol (e.g., "AAPL")
- `analysis` (boolean, optional): Enable full AI analysis (default: true)

**Response:**
```json
{
  "success": true,
  "data": {
    "primaryStock": "AAPL",
    "relatedStocks": ["MSFT", "GOOGL", "TSLA"],
    "correlations": [
      {
        "symbol1": "AAPL",
        "symbol2": "MSFT",
        "correlation": 0.75,
        "strength": "Strong"
      }
    ],
    "insights": [
      {
        "type": "correlation",
        "title": "Strong Tech Sector Correlation",
        "description": "AAPL shows strong correlation with major tech stocks",
        "confidence": 0.85,
        "actionable": true
      }
    ],
    "riskAssessment": {
      "level": "Medium",
      "factors": ["Market volatility", "Sector concentration"]
    },
    "recommendations": ["Consider diversification across sectors"]
  },
  "timestamp": "2024-12-01T12:00:00Z",
  "disclaimer": "This analysis is for educational purposes only"
}
```

### GET /api/stock-sentiment

Fetches stock sentiment data and news.

**Query Parameters:**
- `tickers` (optional): Comma-separated list of stock symbols (default: "AAPL,GOOGL,MSFT")
- `limit` (optional): Number of news articles to return (default: 50, max: 1000)

**Response:**
```json
{
  "success": true,
  "data": {
    "feed": [
      {
        "title": "News Article Title",
        "summary": "Article summary...",
        "url": "https://example.com/article",
        "time_published": "20241201T120000",
        "overall_sentiment_score": 0.123456,
        "overall_sentiment_label": "Neutral",
        "ticker_sentiment": [
          {
            "ticker": "AAPL",
            "relevance_score": "0.5",
            "ticker_sentiment_score": "0.2",
            "ticker_sentiment_label": "Neutral"
          }
        ]
      }
    ]
  },
  "timestamp": "2024-12-01T12:00:00Z",
  "isMockData": false
}
```

## Usage

1. **Search Stocks**: Enter stock ticker symbols (e.g., AAPL, GOOGL, TSLA)
2. **View Sentiment**: See overall market sentiment and individual stock sentiment scores
3. **Read News**: Browse the latest financial news with sentiment analysis
4. **Refresh Data**: Click the refresh button to get the latest information

## API Limits

- **Free Tier**: 25 requests per day
- **Premium Tiers**: Higher limits available at Alpha Vantage

## Project Structure

```
stocksense/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── stock-analysis/
│   │   │   │   └── route.ts          # AI analysis API endpoint
│   │   │   └── stock-sentiment/
│   │   │       └── route.ts          # Sentiment analysis API endpoint
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home page with navigation
│   └── components/
│       ├── AIStockAnalysis.tsx       # AI analysis component
│       ├── Navigation.tsx            # Navigation component
│       └── StockSentiment.tsx        # Sentiment analysis component
├── .env.local                        # Environment variables
├── package.json                      # Dependencies
└── README.md                         # This file
```

## Mock Data

When using the demo API key or when the API limit is reached, the application will display mock data for demonstration purposes.
