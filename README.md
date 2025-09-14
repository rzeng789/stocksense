# StockSense - AI-Powered Stock Analysis Platform

A comprehensive web application that combines real-time stock sentiment analysis with advanced AI-powered correlation insights and risk assessment using Alpha Vantage's APIs and proprietary analysis algorithms.

Core Problem We're Solving
- Traditional financial news analysis tools only provide basic sentiment analysis ("positive" or "negative"). This leaves massive gaps in market intelligence:
- Investors miss connected opportunities in supply chain companies
- Markets often overreact or underreact to news vs. fundamental reality
- Most people only trade the obvious primary company mentioned in news

## Features

### 🧠 Financial Intelligence Engine
- **1. Real-time Article Analysis**: Paste financial article text for instant analysis
- **Stock Impact Scoring**: Quantified impact predictions with confidence levels
- **Related Articles Discovery**: Find and analyze related news automatically
- **Timeline Insights**: Immediate, short-term, and long-term implications
- 🌊 **2. Ripple Effect Detection**
- **Connected Company Mapping**: Identifies suppliers, customers, competitors affected by news
- **Hidden Opportunities**: Finds investment opportunities 2-3 degrees from primary news
- **Impact Scoring**: Rates expected impact (1-10 scale) for each connected company
- ⚖️ **3. Reality vs Sentiment Validation**
- **Market Reaction Analysis**: Compares news sentiment to actual business fundamentals
- **Overreaction Detection**: Spots buying opportunities when market panic exceeds impact
- **Underreaction Alerts**: Identifies early entry opportunities market is missing


### 🎯 AI Stock Analysis Engine
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

### 🔍 Individual Stock Analysis
- **Comprehensive Stock Profiles**: Detailed analysis of individual companies
- **Technical & Fundamental Metrics**: PE ratios, RSI, MACD, volume patterns, and more
- **Analyst Coverage Integration**: Consensus ratings, price targets, and recent changes
- **Performance Tracking**: Multi-timeframe performance analysis
- **Investment Grade Scoring**: Automated recommendation system with entry/exit levels

### 🎨 Modern User Experience
- **Intuitive Navigation**: Switch between different analysis modes seamlessly
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Interactive Components**: Real-time data updates and user-friendly interfaces
- **Mock Data Support**: Fallback to demo data when API limits are reached
- **Dark/Light Theme Support**: Customizable interface themes

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

### POST /api/financial-intelligence

Analyzes financial news headlines and generates comprehensive investment intelligence reports.

**Request Body:**
```json
{
  "input": "Tesla Stock Breaks Out Past Buy Point. It's Not About EVs."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "newsResearch": {
      "totalArticlesAnalyzed": 15,
      "searchQueries": ["Tesla stock analysis", "EV market trends"],
      "newsSources": [...]
    },
    "primaryCompanyAnalysis": {
      "ticker": "TSLA",
      "companyName": "Tesla Inc",
      "currentPrice": 248.50,
      "technicalPosition": {...},
      "fundamentalValuation": {...},
      "investmentGrade": {
        "recommendation": "BUY",
        "confidenceScore": 0.85,
        "riskLevel": "Moderate"
      }
    },
    "rippleEffects": [...],
    "realityVsSentiment": {...},
    "intelligenceReport": {
      "executiveSummary": {...},
      "detailedRecommendations": [...],
      "marketIntelligenceInsights": {...}
    }
  },
  "timestamp": "2024-12-01T12:00:00Z"
}
```

### POST /api/article-analysis

Analyzes financial articles for stock market impact and generates detailed insights.

**Request Body:**
```json
{
  "articleText": "Full article text or URL",
  "analysisDepth": "comprehensive"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "originalArticle": {
      "headline": "Article Title",
      "summary": "Article summary",
      "source": "Financial Times",
      "publishedDate": "2024-12-01"
    },
    "stockImpacts": [
      {
        "ticker": "AAPL",
        "companyName": "Apple Inc",
        "impactScore": 0.75,
        "impactLevel": "Positive",
        "confidence": 0.85,
        "timeframe": "Short-term",
        "reasoning": ["Strong earnings beat", "New product launch"]
      }
    ],
    "sectorImpacts": [...],
    "overallMarketSentiment": {
      "score": 0.65,
      "label": "Positive",
      "confidence": 0.80
    },
    "keyInsights": [...],
    "timeline": {...}
  }
}
```

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

### Financial Intelligence Engine
1. **Enter News Headlines**: Paste any financial news headline or market event
2. **Get AI Analysis**: Receive comprehensive investment intelligence reports
3. **Review Recommendations**: See BUY/SELL/HOLD recommendations with confidence scores
4. **Explore Ripple Effects**: Understand how news affects connected companies
5. **Compare Reality vs Sentiment**: Identify market overreactions and opportunities

### Article Impact Dashboard
1. **Paste Article Content**: Enter full article text or URL for analysis
2. **View Stock Impacts**: See quantified impact predictions for individual stocks
3. **Analyze Sectors**: Understand which market sectors will be most affected
4. **Interactive Charts**: Explore sentiment distribution and impact timelines
5. **Related Articles**: Discover and analyze related news stories

### Stock Analysis & Sentiment
1. **Search Stocks**: Enter stock ticker symbols (e.g., AAPL, GOOGL, TSLA)
2. **View Sentiment**: See overall market sentiment and individual stock sentiment scores
3. **Read News**: Browse the latest financial news with sentiment analysis
4. **Individual Analysis**: Get detailed company profiles with technical and fundamental metrics
5. **Refresh Data**: Click the refresh button to get the latest information

## API Limits

- **Free Tier**: 25 requests per day
- **Premium Tiers**: Higher limits available at Alpha Vantage

## Project Structure

```
stocksense/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── financial-intelligence/
│   │   │   │   └── route.ts          # Financial intelligence API endpoint
│   │   │   ├── article-analysis/
│   │   │   │   └── route.ts          # Article analysis API endpoint
│   │   │   ├── stock-analysis/
│   │   │   │   └── route.ts          # AI stock analysis API endpoint
│   │   │   └── stock-sentiment/
│   │   │       └── route.ts          # Sentiment analysis API endpoint
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home page with navigation
│   ├── components/
│   │   ├── FinancialIntelligence.tsx # Financial intelligence engine
│   │   ├── ArticleImpactDashboard.tsx# Article impact analysis dashboard
│   │   ├── AIStockAnalysis.tsx       # AI stock analysis component
│   │   ├── AIStockAnalysisEngine.tsx # Enhanced AI analysis engine
│   │   ├── IndividualStockAnalysis.tsx# Individual stock analysis component
│   │   ├── StockSenseAI.tsx          # AI-powered stock insights
│   │   ├── Navigation.tsx            # Navigation component
│   │   └── StockSentiment.tsx        # Sentiment analysis component
│   └── lib/
│       ├── webScraper.ts             # Web scraping utilities
│       └── aiAnalysis.ts             # AI analysis engine
├── .env.local                        # Environment variables
├── package.json                      # Dependencies
└── README.md                         # This file
```

## Mock Data

When using the demo API key or when the API limit is reached, the application will display mock data for demonstration purposes.
