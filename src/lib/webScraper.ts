import axios from 'axios';
import * as cheerio from 'cheerio';
import { JSDOM } from 'jsdom';

// Interfaces
interface ScrapedArticle {
  headline: string;
  fullText: string;
  url: string;
  publishedDate: string;
  source: string;
  author?: string;
  summary: string;
  imageUrl?: string;
}

interface RelatedArticle {
  headline: string;
  url: string;
  source: string;
  publishedDate: string;
  relevanceScore: number;
  summary: string;
}

interface NewsSearchResult {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  description: string;
  urlToImage?: string;
}

// Common news domains and their selectors
const NEWS_SELECTORS = {
  'reuters.com': {
    headline: 'h1[data-testid="Heading"], h1.ArticleHeader_headline',
    content: '[data-testid="paragraph"], .StandardArticleBody_body p',
    author: '[data-testid="AuthorByline"], .ArticleHeader_author',
    date: 'time[datetime], .ArticleHeader_date',
    source: 'Reuters'
  },
  'bloomberg.com': {
    headline: 'h1[data-module="ArticleHeader"], h1.lede-text-only__hed',
    content: '.body-content p, [data-module="ArticleBody"] p',
    author: '.author-link, .byline__author',
    date: 'time[datetime], .article-timestamp',
    source: 'Bloomberg'
  },
  'cnbc.com': {
    headline: 'h1.ArticleHeader-headline, h1.InlineArticleHeader-headline',
    content: '.ArticleBody-articleBody p, .InlineArticleBody-container p',
    author: '.Author-authorName, .InlineArticleHeader-author',
    date: 'time[data-module="ArticleHeader"], .ArticleHeader-time',
    source: 'CNBC'
  },
  'marketwatch.com': {
    headline: 'h1.article__headline, h1.title',
    content: '.article__content p, .article-wrap p',
    author: '.author__name, .byline__author',
    date: '.article__timestamp, .timestamp',
    source: 'MarketWatch'
  },
  'yahoo.com': {
    headline: 'h1[data-test-locator="headline"], h1.caas-title-wrapper',
    content: '.caas-body p, .article-content p',
    author: '.caas-author-byline, .author-name',
    date: 'time[datetime], .article-date',
    source: 'Yahoo Finance'
  },
  'wsj.com': {
    headline: 'h1.wsj-article-headline, h1.headline',
    content: '.wsj-snippet-body p, .article-content p',
    author: '.author-name, .byline',
    date: 'time[datetime], .timestamp',
    source: 'Wall Street Journal'
  },
  'default': {
    headline: 'h1, .headline, .title, [class*="headline"], [class*="title"]',
    content: 'article p, .content p, .article-content p, .post-content p, main p',
    author: '.author, .byline, [class*="author"], [class*="byline"]',
    date: 'time, .date, .timestamp, [class*="date"], [class*="time"]',
    source: 'Unknown'
  }
};

// Mock news API for demonstration (in production, use real news APIs)
const MOCK_NEWS_SOURCES = [
  {
    name: 'Financial Times',
    baseUrl: 'https://www.ft.com',
    apiKey: process.env.FT_API_KEY
  },
  {
    name: 'Reuters',
    baseUrl: 'https://www.reuters.com',
    apiKey: process.env.REUTERS_API_KEY
  },
  {
    name: 'Bloomberg',
    baseUrl: 'https://www.bloomberg.com',
    apiKey: process.env.BLOOMBERG_API_KEY
  }
];

class WebScraper {
  private userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  
  /**
   * Extract article content from a given URL
   */
  async scrapeArticle(url: string): Promise<ScrapedArticle | null> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const domain = new URL(url).hostname;
      const selectors = this.getSelectorsForDomain(domain);

      // Extract content using selectors
      const headline = this.extractText($, selectors.headline);
      const contentParagraphs = $(selectors.content).map((_, el) => $(el).text().trim()).get();
      const fullText = contentParagraphs.filter(p => p.length > 20).join('\n\n');
      const author = this.extractText($, selectors.author);
      const dateText = this.extractText($, selectors.date) || $(selectors.date).attr('datetime');
      
      // Try to extract published date
      let publishedDate = new Date().toISOString();
      if (dateText) {
        const parsedDate = new Date(dateText);
        if (!isNaN(parsedDate.getTime())) {
          publishedDate = parsedDate.toISOString();
        }
      }

      // Generate summary (first 2-3 sentences)
      const summary = this.generateSummary(fullText);

      // Extract image
      const imageUrl = $('meta[property="og:image"]').attr('content') || 
                      $('img').first().attr('src');

      if (!headline || !fullText) {
        throw new Error('Could not extract essential content');
      }

      return {
        headline: headline.trim(),
        fullText: fullText.trim(),
        url,
        publishedDate,
        source: selectors.source,
        author: author?.trim(),
        summary: summary.trim(),
        imageUrl
      };
    } catch (error) {
      console.error(`Error scraping article from ${url}:`, error);
      return null;
    }
  }

  /**
   * Find related articles based on keywords from the original headline
   */
  async findRelatedArticles(headline: string, limit: number = 5): Promise<RelatedArticle[]> {
    try {
      // Extract keywords from headline
      const keywords = this.extractKeywords(headline);
      
      // In a real implementation, you would use news APIs like:
      // - NewsAPI (newsapi.org)
      // - Google News API
      // - Bing News API
      // - Reuters API
      // - Bloomberg API
      
      // For now, return mock related articles
      const mockRelatedArticles: RelatedArticle[] = [
        {
          headline: "Tech Stocks Rally as AI Investment Surge Continues",
          url: "https://example.com/tech-rally-ai-investment",
          source: "Reuters",
          publishedDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          relevanceScore: 0.85,
          summary: "Major technology companies see significant gains as artificial intelligence investments drive market optimism."
        },
        {
          headline: "Market Analysis: Sector Rotation Impacts Growth Stocks",
          url: "https://example.com/sector-rotation-analysis",
          source: "Bloomberg",
          publishedDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          relevanceScore: 0.72,
          summary: "Investors shift focus from growth to value stocks amid changing economic conditions."
        },
        {
          headline: "Federal Reserve Policy Impact on Financial Markets",
          url: "https://example.com/fed-policy-markets",
          source: "Wall Street Journal",
          publishedDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          relevanceScore: 0.68,
          summary: "Latest Federal Reserve decisions continue to influence trading patterns across major indices."
        },
        {
          headline: "Earnings Season Preview: Key Companies to Watch",
          url: "https://example.com/earnings-preview",
          source: "CNBC",
          publishedDate: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          relevanceScore: 0.64,
          summary: "Upcoming earnings reports from major corporations expected to drive market volatility."
        },
        {
          headline: "Global Economic Indicators Signal Market Uncertainty",
          url: "https://example.com/global-economic-indicators",
          source: "Financial Times",
          publishedDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          relevanceScore: 0.59,
          summary: "International economic data points to potential challenges for equity markets."
        }
      ];

      // Filter and sort by relevance
      return mockRelatedArticles
        .filter(article => this.calculateRelevance(headline, article.headline) > 0.5)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit);
        
    } catch (error) {
      console.error('Error finding related articles:', error);
      return [];
    }
  }

  /**
   * Search for articles using external news APIs with enhanced relevance matching
   */
  async searchNews(query: string, limit: number = 10): Promise<NewsSearchResult[]> {
    try {
      // Extract keywords for better search targeting
      const keywords = this.extractKeywords(query);
      const isFinancialNews = keywords.some(k => 
        ['stock', 'market', 'trading', 'investment', 'earnings', 'revenue', 'profit'].includes(k.toLowerCase())
      );
      const isTechNews = keywords.some(k => 
        ['ai', 'technology', 'software', 'innovation', 'digital', 'tech'].includes(k.toLowerCase())
      );
      
      // Enhanced mock implementation with better categorization
      const mockResults: NewsSearchResult[] = [];
      
      if (isFinancialNews) {
        mockResults.push(
          {
            title: `${query} - Market Impact Analysis`,
            url: `https://finance.yahoo.com/news/${query.toLowerCase().replace(/\s+/g, '-')}`,
            source: "Yahoo Finance",
            publishedAt: new Date(Date.now() - Math.random() * 86400000 * 2).toISOString(),
            description: `Financial experts analyze the market implications of ${query}. Stock movements and sector impacts expected.`
          },
          {
            title: `Wall Street Reacts: ${query} Drives Trading Activity`,
            url: `https://bloomberg.com/news/${query.toLowerCase().replace(/\s+/g, '-')}`,
            source: "Bloomberg",
            publishedAt: new Date(Date.now() - Math.random() * 86400000 * 1).toISOString(),
            description: `Institutional investors adjust portfolios following ${query}. Options activity surges.`
          }
        );
      }
      
      if (isTechNews) {
        mockResults.push(
          {
            title: `Tech Industry Responds to ${query}`,
            url: `https://techcrunch.com/news/${query.toLowerCase().replace(/\s+/g, '-')}`,
            source: "TechCrunch",
            publishedAt: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
            description: `Technology leaders share insights on ${query} and its implications for innovation.`
          }
        );
      }
      
      // Add general business news
      mockResults.push(
        {
          title: `Business Impact: ${query} Reshapes Industry Outlook`,
          url: `https://reuters.com/business/${query.toLowerCase().replace(/\s+/g, '-')}`,
          source: "Reuters",
          publishedAt: new Date(Date.now() - Math.random() * 86400000 * 4).toISOString(),
          description: `Industry experts analyze ${query} and its broader business implications.`
        }
      );
      
      return mockResults.slice(0, limit);
    } catch (error) {
      console.error('Error searching news:', error);
      return [];
    }
  }

  /**
   * Get appropriate selectors for a domain
   */
  private getSelectorsForDomain(domain: string) {
    for (const [key, selectors] of Object.entries(NEWS_SELECTORS)) {
      if (domain.includes(key)) {
        return selectors;
      }
    }
    return NEWS_SELECTORS.default;
  }

  /**
   * Extract text using multiple selectors
   */
  private extractText($: cheerio.Root, selectors: string): string {
    const elements = $(selectors);
    for (let i = 0; i < elements.length; i++) {
      const text = $(elements[i]).text().trim();
      if (text && text.length > 10) {
        return text;
      }
    }
    return '';
  }

  /**
   * Generate a summary from full text
   */
  private generateSummary(fullText: string, maxSentences: number = 3): string {
    if (!fullText) return '';
    
    const sentences = fullText.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences.slice(0, maxSentences).join('. ').trim() + (sentences.length > maxSentences ? '.' : '');
  }

  /**
   * Extract keywords from headline
   */
  private extractKeywords(headline: string): string[] {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
    ]);

    return headline
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .slice(0, 10); // Limit to top 10 keywords
  }

  /**
   * Calculate relevance between two headlines with enhanced similarity matching
   */
  private calculateRelevance(headline1: string, headline2: string): number {
    const keywords1 = new Set(this.extractKeywords(headline1));
    const keywords2 = new Set(this.extractKeywords(headline2));
    
    // Basic keyword intersection score
    const intersection = new Set([...keywords1].filter(x => keywords2.has(x)));
    const union = new Set([...keywords1, ...keywords2]);
    const jaccardScore = union.size > 0 ? intersection.size / union.size : 0;
    
    // Enhanced similarity factors
    const text1 = headline1.toLowerCase();
    const text2 = headline2.toLowerCase();
    
    // Partial word matching boost
    let partialMatches = 0;
    for (const word1 of keywords1) {
      for (const word2 of keywords2) {
        if (word1.includes(word2) || word2.includes(word1)) {
          partialMatches++;
        }
      }
    }
    const partialScore = partialMatches > 0 ? 0.2 : 0;
    
    // Company/stock symbol detection
    const stockSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'NFLX'];
    const symbolBoost = stockSymbols.some(symbol => 
      text1.includes(symbol.toLowerCase()) && text2.includes(symbol.toLowerCase())
    ) ? 0.3 : 0;
    
    // Financial terms matching
    const financialTerms = ['earnings', 'revenue', 'profit', 'stock', 'market', 'trading', 'investment'];
    const financialMatches = financialTerms.filter(term => 
      text1.includes(term) && text2.includes(term)
    ).length;
    const financialBoost = financialMatches > 0 ? financialMatches * 0.1 : 0;
    
    const totalScore = jaccardScore + partialScore + symbolBoost + financialBoost;
    return Math.min(totalScore, 1.0);
  }

  /**
   * Validate URL format
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Clean and normalize URL
   */
  normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Remove tracking parameters
      const cleanParams = new URLSearchParams();
      for (const [key, value] of urlObj.searchParams) {
        if (!key.startsWith('utm_') && !key.startsWith('fb_') && key !== 'ref') {
          cleanParams.set(key, value);
        }
      }
      urlObj.search = cleanParams.toString();
      return urlObj.toString();
    } catch {
      return url;
    }
  }
}

// Export singleton instance
export const webScraper = new WebScraper();
export default webScraper;

// Export types
export type { ScrapedArticle, RelatedArticle, NewsSearchResult };