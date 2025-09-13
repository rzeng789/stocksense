import { NextRequest, NextResponse } from 'next/server';
import { webScraper } from '@/lib/webScraper';
import { aiAnalysisEngine } from '@/lib/aiAnalysis';

// Interfaces for article analysis
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
  impactScore: number; // -1 to 1 scale
  impactLevel: 'Very Negative' | 'Negative' | 'Neutral' | 'Positive' | 'Very Positive';
  confidence: number; // 0 to 1
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

// Enhanced article extraction with web scraping capability
const extractArticleContent = async (headline: string): Promise<ArticleContent> => {
  // Try to extract URL from headline if it contains one
  const urlMatch = headline.match(/https?:\/\/[^\s]+/);
  
  if (urlMatch) {
    // If headline contains a URL, scrape the actual article
    const scrapedArticle = await webScraper.scrapeArticle(urlMatch[0]);
    if (scrapedArticle) {
      return scrapedArticle;
    }
    // Fallback to mock if scraping fails
    return {
      headline,
      fullText: `Analysis based on headline: "${headline}". Unable to extract full article content, but analysis proceeds based on available information and market context.`,
      url: urlMatch[0],
      publishedDate: new Date().toISOString(),
      source: 'Extracted from URL',
      summary: `Analysis of "${headline}" based on headline content and market context.`
    };
  }
  
  // Simulate article extraction based on headline for known examples
  const mockArticles: Record<string, ArticleContent> = {
    'apple': {
      headline: 'Apple Reports Record Q4 Earnings, iPhone Sales Surge',
      fullText: 'Apple Inc. reported record-breaking fourth-quarter earnings today, with iPhone sales exceeding analyst expectations by 15%. The company posted revenue of $94.9 billion, up 8% year-over-year, driven by strong demand for the iPhone 15 series and robust services growth. CEO Tim Cook highlighted the success of Apple Intelligence features and expanding market share in emerging markets. The company also announced a $25 billion share buyback program and raised its dividend by 4%. Apple\'s Services segment, including the App Store, iCloud, and Apple Pay, grew 16% to $22.3 billion, demonstrating the company\'s successful transition to a services-focused business model.',
      url: 'https://example.com/apple-earnings',
      publishedDate: '2024-01-25T16:30:00Z',
      source: 'Financial Times',
      author: 'Sarah Johnson',
      summary: 'Apple exceeds Q4 expectations with record iPhone sales and strong services growth, announcing major buyback program.'
    },
    'tesla': {
      headline: 'Tesla Announces Major Breakthrough in Battery Technology',
      fullText: 'Tesla has unveiled a revolutionary new battery technology that could increase electric vehicle range by 40% while reducing costs by 30%. The new 4680 battery cells feature advanced silicon nanowire anodes and solid-state electrolytes, representing a significant leap forward in energy density and safety. CEO Elon Musk announced that the technology will be integrated into all Tesla vehicles by 2025, starting with the Cybertruck and Model S Plaid. The breakthrough could accelerate Tesla\'s path to producing a $25,000 electric vehicle and strengthen its position against growing competition from traditional automakers and Chinese EV manufacturers.',
      url: 'https://example.com/tesla-battery',
      publishedDate: '2024-01-25T14:15:00Z',
      source: 'Reuters',
      author: 'Michael Chen',
      summary: 'Tesla unveils breakthrough battery technology promising 40% more range and 30% cost reduction, accelerating EV adoption timeline.'
    },
    'microsoft': {
      headline: 'Microsoft AI Revenue Surges 200% as Enterprise Adoption Accelerates',
      fullText: 'Microsoft Corporation reported explosive growth in its AI business segment, with revenue increasing 200% year-over-year to $3.2 billion in Q4. The surge is driven by widespread enterprise adoption of Microsoft Copilot across Office 365, Azure AI services, and GitHub Copilot. Over 65% of Fortune 500 companies are now using Microsoft AI tools, with average productivity gains of 25% reported by early adopters. The company also announced new AI partnerships with major consulting firms and expanded its Azure OpenAI service to 50 new regions globally. Microsoft\'s AI success is positioning it as the clear leader in enterprise artificial intelligence solutions.',
      url: 'https://example.com/microsoft-ai',
      publishedDate: '2024-01-25T15:45:00Z',
      source: 'Wall Street Journal',
      author: 'David Rodriguez',
      summary: 'Microsoft AI revenue explodes 200% with massive enterprise adoption of Copilot and Azure AI services across Fortune 500 companies.'
    }
  };

  // Simple keyword matching for demo
  const key = Object.keys(mockArticles).find(k => 
    headline.toLowerCase().includes(k)
  );
  
  return key ? mockArticles[key] : {
    headline: headline,
    fullText: `Comprehensive analysis of the headline: "${headline}". This analysis examines potential market implications, sector impacts, and individual stock effects based on the headline content and current market conditions. The system evaluates both immediate and long-term consequences for relevant securities.`,
    url: 'https://example.com/headline-analysis',
    publishedDate: new Date().toISOString(),
    source: 'Headline Analysis',
    author: 'AI Analysis System',
    summary: `Market impact analysis of "${headline}" examining potential effects on stocks and sectors.`
  };
};

// Enhanced related articles discovery with web scraping
const findRelatedArticles = async (headline: string): Promise<RelatedArticle[]> => {
  // Find related articles using web scraper
  const scrapedRelated = await webScraper.findRelatedArticles(headline, 5);
  
  // If scraping successful, return those results
  if (scrapedRelated && scrapedRelated.length > 0) {
    return scrapedRelated;
  }
  
  // Fallback to mock related articles
  const relatedArticles: RelatedArticle[] = [
    {
      headline: 'Tech Sector Rally Continues Amid AI Optimism',
      url: 'https://example.com/tech-rally',
      source: 'Bloomberg',
      publishedDate: '2024-01-25T12:00:00Z',
      relevanceScore: 0.85,
      summary: 'Technology stocks surge as investors bet on AI-driven growth and digital transformation trends.'
    },
    {
      headline: 'Analysts Upgrade Tech Stocks Following Strong Earnings',
      url: 'https://example.com/analyst-upgrades',
      source: 'CNBC',
      publishedDate: '2024-01-25T10:30:00Z',
      relevanceScore: 0.78,
      summary: 'Major investment banks raise price targets on leading technology companies after impressive quarterly results.'
    },
    {
      headline: 'Market Volatility Expected as Fed Decision Approaches',
      url: 'https://example.com/fed-decision',
      source: 'MarketWatch',
      publishedDate: '2024-01-25T09:15:00Z',
      relevanceScore: 0.65,
      summary: 'Investors brace for potential market swings ahead of Federal Reserve interest rate announcement.'
    }
  ];

  return relatedArticles;
};

// AI-powered stock impact analysis
const analyzeStockImpact = async (article: ArticleContent, relatedArticles: RelatedArticle[]): Promise<StockImpact[]> => {
  // Mock AI analysis based on article content
  const impacts: StockImpact[] = [];

  // Analyze based on keywords and content
  if (article.headline.toLowerCase().includes('apple') || article.fullText.toLowerCase().includes('apple')) {
    impacts.push({
      ticker: 'AAPL',
      companyName: 'Apple Inc.',
      impactScore: 0.75,
      impactLevel: 'Very Positive',
      confidence: 0.92,
      timeframe: 'Short-term',
      reasoning: [
        'Record earnings beat analyst expectations',
        'Strong iPhone sales growth indicates robust demand',
        'Services revenue growth shows diversification success',
        'Share buyback program supports stock price'
      ],
      priceTarget: {
        current: 185.50,
        predicted: 205.00,
        change: 19.50,
        changePercent: 10.5
      }
    });
  }

  if (article.headline.toLowerCase().includes('tesla') || article.fullText.toLowerCase().includes('tesla')) {
    impacts.push({
      ticker: 'TSLA',
      companyName: 'Tesla Inc.',
      impactScore: 0.85,
      impactLevel: 'Very Positive',
      confidence: 0.88,
      timeframe: 'Medium-term',
      reasoning: [
        'Revolutionary battery technology breakthrough',
        '40% range improvement competitive advantage',
        '30% cost reduction improves margins',
        'Accelerates path to mass-market EV adoption'
      ],
      priceTarget: {
        current: 248.50,
        predicted: 295.00,
        change: 46.50,
        changePercent: 18.7
      }
    });
  }

  if (article.headline.toLowerCase().includes('microsoft') || article.fullText.toLowerCase().includes('microsoft')) {
    impacts.push({
      ticker: 'MSFT',
      companyName: 'Microsoft Corporation',
      impactScore: 0.80,
      impactLevel: 'Very Positive',
      confidence: 0.90,
      timeframe: 'Short-term',
      reasoning: [
        '200% AI revenue growth demonstrates market leadership',
        'Enterprise adoption of Copilot accelerating',
        '65% Fortune 500 penetration shows strong demand',
        'Expanding Azure AI services globally'
      ],
      priceTarget: {
        current: 378.25,
        predicted: 425.00,
        change: 46.75,
        changePercent: 12.4
      }
    });
  }

  // Add related stock impacts
  impacts.push(
    {
      ticker: 'GOOGL',
      companyName: 'Alphabet Inc.',
      impactScore: 0.45,
      impactLevel: 'Positive',
      confidence: 0.72,
      timeframe: 'Medium-term',
      reasoning: [
        'Benefits from overall tech sector optimism',
        'AI competition intensifies market dynamics',
        'Cloud services growth potential'
      ],
      priceTarget: {
        current: 142.80,
        predicted: 155.00,
        change: 12.20,
        changePercent: 8.5
      }
    },
    {
      ticker: 'NVDA',
      companyName: 'NVIDIA Corporation',
      impactScore: 0.65,
      impactLevel: 'Positive',
      confidence: 0.85,
      timeframe: 'Short-term',
      reasoning: [
        'AI boom drives GPU demand',
        'Data center growth accelerating',
        'Partnership opportunities with major tech companies'
      ],
      priceTarget: {
        current: 875.50,
        predicted: 950.00,
        change: 74.50,
        changePercent: 8.5
      }
    }
  );

  return impacts;
};

// Analyze sector impacts
const analyzeSectorImpacts = async (stockImpacts: StockImpact[]): Promise<MarketSector[]> => {
  return [
    {
      name: 'Technology',
      impactScore: 0.72,
      affectedStocks: ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'TSLA'],
      reasoning: 'Strong earnings and AI developments drive sector-wide optimism and investment flows.'
    },
    {
      name: 'Automotive',
      impactScore: 0.55,
      affectedStocks: ['TSLA', 'F', 'GM'],
      reasoning: 'EV technology breakthroughs accelerate industry transformation and competitive dynamics.'
    },
    {
      name: 'Semiconductors',
      impactScore: 0.68,
      affectedStocks: ['NVDA', 'AMD', 'INTC'],
      reasoning: 'AI and advanced computing demands drive chip innovation and market expansion.'
    }
  ];
};

export async function POST(request: NextRequest) {
  try {
    const { headline } = await request.json();

    if (!headline || typeof headline !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid headline is required' },
        { status: 400 }
      );
    }

    // Extract article content
    const originalArticle = await extractArticleContent(headline);
    
    // Find related articles
    const relatedArticles = await findRelatedArticles(headline);
    
    // Use AI analysis engine for comprehensive impact analysis
    const aiAnalysis = await aiAnalysisEngine.analyzeArticleImpact(
      originalArticle.headline,
      originalArticle.fullText
    );

    const response: ArticleAnalysisResponse = {
      originalArticle,
      relatedArticles,
      stockImpacts: aiAnalysis.stockImpacts,
      sectorImpacts: aiAnalysis.sectorImpacts,
      overallMarketSentiment: aiAnalysis.overallMarketSentiment,
      keyInsights: aiAnalysis.keyInsights,
      riskFactors: aiAnalysis.riskFactors,
      opportunities: aiAnalysis.opportunities,
      timeline: aiAnalysis.timeline
    };

    return NextResponse.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString(),
      disclaimer: 'This analysis is for educational purposes only and should not be considered as financial advice. Always conduct your own research and consult with financial professionals before making investment decisions.'
    });

  } catch (error) {
    console.error('Article analysis error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze article' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Article Analysis API - Use POST method with headline in request body',
    endpoints: {
      analyze: 'POST /api/article-analysis',
      parameters: {
        headline: 'string - The article headline to analyze'
      }
    }
  });
}