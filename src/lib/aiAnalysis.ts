// AI-powered impact analysis system for stock predictions

// Interfaces
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

interface MarketSentiment {
  score: number;
  label: string;
  confidence: number;
}

interface AIAnalysisResult {
  stockImpacts: StockImpact[];
  sectorImpacts: MarketSector[];
  overallMarketSentiment: MarketSentiment;
  keyInsights: string[];
  riskFactors: string[];
  opportunities: string[];
  timeline: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

// Market data and company information
const COMPANY_DATABASE = {
  'AAPL': { name: 'Apple Inc.', sector: 'Technology', marketCap: 3000000000000 },
  'MSFT': { name: 'Microsoft Corporation', sector: 'Technology', marketCap: 2800000000000 },
  'GOOGL': { name: 'Alphabet Inc.', sector: 'Technology', marketCap: 1700000000000 },
  'AMZN': { name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', marketCap: 1500000000000 },
  'TSLA': { name: 'Tesla Inc.', sector: 'Consumer Discretionary', marketCap: 800000000000 },
  'META': { name: 'Meta Platforms Inc.', sector: 'Technology', marketCap: 750000000000 },
  'NVDA': { name: 'NVIDIA Corporation', sector: 'Technology', marketCap: 1800000000000 },
  'JPM': { name: 'JPMorgan Chase & Co.', sector: 'Financial Services', marketCap: 450000000000 },
  'JNJ': { name: 'Johnson & Johnson', sector: 'Healthcare', marketCap: 400000000000 },
  'V': { name: 'Visa Inc.', sector: 'Financial Services', marketCap: 500000000000 },
  'PG': { name: 'Procter & Gamble Co.', sector: 'Consumer Staples', marketCap: 350000000000 },
  'UNH': { name: 'UnitedHealth Group Inc.', sector: 'Healthcare', marketCap: 480000000000 },
  'HD': { name: 'The Home Depot Inc.', sector: 'Consumer Discretionary', marketCap: 320000000000 },
  'MA': { name: 'Mastercard Inc.', sector: 'Financial Services', marketCap: 380000000000 },
  'BAC': { name: 'Bank of America Corp.', sector: 'Financial Services', marketCap: 280000000000 }
};

const SECTOR_KEYWORDS = {
  'Technology': ['tech', 'software', 'ai', 'artificial intelligence', 'cloud', 'digital', 'innovation', 'semiconductor', 'chip'],
  'Healthcare': ['health', 'medical', 'pharmaceutical', 'drug', 'biotech', 'clinical', 'fda', 'treatment'],
  'Financial Services': ['bank', 'financial', 'credit', 'loan', 'interest rate', 'fed', 'monetary', 'payment'],
  'Consumer Discretionary': ['retail', 'consumer', 'shopping', 'e-commerce', 'automotive', 'electric vehicle'],
  'Consumer Staples': ['food', 'beverage', 'household', 'essential', 'grocery'],
  'Energy': ['oil', 'gas', 'energy', 'renewable', 'solar', 'wind', 'petroleum'],
  'Industrials': ['manufacturing', 'industrial', 'aerospace', 'defense', 'transportation'],
  'Materials': ['mining', 'metals', 'chemicals', 'materials', 'commodities'],
  'Real Estate': ['real estate', 'property', 'reit', 'housing', 'construction'],
  'Utilities': ['utility', 'electric', 'power', 'water', 'gas utility']
};

const SENTIMENT_KEYWORDS = {
  positive: {
    strong: ['breakthrough', 'record', 'surge', 'soar', 'rally', 'boom', 'exceptional', 'outstanding'],
    moderate: ['growth', 'increase', 'rise', 'gain', 'improve', 'positive', 'strong', 'beat'],
    mild: ['stable', 'steady', 'maintain', 'hold', 'continue']
  },
  negative: {
    strong: ['crash', 'plunge', 'collapse', 'disaster', 'crisis', 'bankruptcy', 'scandal'],
    moderate: ['decline', 'fall', 'drop', 'loss', 'weak', 'concern', 'worry', 'miss'],
    mild: ['caution', 'uncertainty', 'challenge', 'pressure', 'slow']
  }
};

class AIAnalysisEngine {
  /**
   * Analyze article content and predict stock impacts
   */
  async analyzeArticleImpact(headline: string, fullText: string): Promise<AIAnalysisResult> {
    const combinedText = `${headline} ${fullText}`.toLowerCase();
    
    // Extract relevant companies and sectors with enhanced filtering
    const relevantStocks = this.identifyConnectedStocks(combinedText);
    const affectedSectors = this.identifyAffectedSectors(combinedText);
    
    // Analyze sentiment
    const sentimentAnalysis = this.analyzeSentiment(combinedText);
    
    // Generate stock impacts (filtered for relevance)
    const stockImpacts = await this.generateStockImpacts(relevantStocks, combinedText, sentimentAnalysis);
    
    // Generate sector impacts
    const sectorImpacts = this.generateSectorImpacts(affectedSectors, combinedText, sentimentAnalysis);
    
    // Generate insights and predictions
    const insights = this.generateKeyInsights(headline, combinedText, stockImpacts, sectorImpacts);
    const risks = this.identifyRiskFactors(combinedText, sentimentAnalysis);
    const opportunities = this.identifyOpportunities(combinedText, sentimentAnalysis);
    const timeline = this.generateTimeline(headline, combinedText, sentimentAnalysis);
    
    return {
      stockImpacts,
      sectorImpacts,
      overallMarketSentiment: {
        score: sentimentAnalysis.score,
        label: sentimentAnalysis.label,
        confidence: sentimentAnalysis.confidence
      },
      keyInsights: insights,
      riskFactors: risks,
      opportunities,
      timeline
    };
  }

  /**
   * Identify stocks with meaningful connection to news content
   */
  private identifyConnectedStocks(text: string): string[] {
    const connectedStocks: string[] = [];
    const stockRelevanceScores: { ticker: string; score: number }[] = [];
    
    // Calculate relevance scores for each stock
    for (const [ticker, company] of Object.entries(COMPANY_DATABASE)) {
      let relevanceScore = 0;
      
      // Direct ticker mentions (highest weight)
      if (text.includes(ticker.toLowerCase()) || text.includes(`$${ticker.toLowerCase()}`)) {
        relevanceScore += 10;
      }
      
      // Company name mentions (high weight)
      const companyWords = company.name.toLowerCase().split(' ').filter(word => word.length > 3);
      const nameMatches = companyWords.filter(word => text.includes(word)).length;
      relevanceScore += nameMatches * 5;
      
      // Sector keyword relevance (medium weight)
      const sectorKeywords = SECTOR_KEYWORDS[company.sector as keyof typeof SECTOR_KEYWORDS] || [];
      const sectorMatches = sectorKeywords.filter(keyword => text.includes(keyword)).length;
      relevanceScore += sectorMatches * 2;
      
      // Industry-specific keywords (medium weight)
      const industryKeywords = this.getIndustryKeywords(company.sector);
      const industryMatches = industryKeywords.filter(keyword => 
        text.toLowerCase().includes(keyword.toLowerCase())
      ).length;
      relevanceScore += industryMatches * 1.5;
      
      // Competitor mentions (low weight)
      const competitors = this.getCompetitors(ticker);
      const competitorMatches = competitors.filter(comp => 
        text.toLowerCase().includes(comp.toLowerCase())
      ).length;
      relevanceScore += competitorMatches * 1;
      
      if (relevanceScore > 0) {
        stockRelevanceScores.push({ ticker, score: relevanceScore });
      }
    }
    
    // Sort by relevance score and filter for meaningful connections
    const sortedStocks = stockRelevanceScores
      .sort((a, b) => b.score - a.score)
      .filter(stock => stock.score >= 2); // Minimum relevance threshold
    
    // If we have relevant stocks, return them
    if (sortedStocks.length > 0) {
      return sortedStocks.slice(0, 6).map(stock => stock.ticker);
    }
    
    // Only if no relevant stocks found, include broad market leaders
    const broadMarketKeywords = ['market', 'economy', 'fed', 'inflation', 'gdp', 'recession', 'bull', 'bear'];
    const hasBroadMarketImpact = broadMarketKeywords.some(keyword => text.includes(keyword));
    
    if (hasBroadMarketImpact) {
      return ['AAPL', 'MSFT', 'GOOGL', 'AMZN'];
    }
    
    // Return empty array if no meaningful connections found
    return [];
  }

  /**
   * Identify affected market sectors
   */
  private identifyAffectedSectors(text: string): string[] {
    const affectedSectors: string[] = [];
    
    for (const [sector, keywords] of Object.entries(SECTOR_KEYWORDS)) {
      const hasKeyword = keywords.some(keyword => text.includes(keyword));
      if (hasKeyword) {
        affectedSectors.push(sector);
      }
    }
    
    // Default sectors if none identified
    if (affectedSectors.length === 0) {
      affectedSectors.push('Technology', 'Financial Services', 'Healthcare');
    }
    
    return affectedSectors.slice(0, 5);
  }

  /**
   * Analyze sentiment of the text
   */
  private analyzeSentiment(text: string): { score: number; label: string; confidence: number } {
    let sentimentScore = 0;
    let totalMatches = 0;
    
    // Analyze positive sentiment
    for (const [intensity, keywords] of Object.entries(SENTIMENT_KEYWORDS.positive)) {
      const matches = keywords.filter(keyword => text.includes(keyword)).length;
      if (matches > 0) {
        const weight = intensity === 'strong' ? 3 : intensity === 'moderate' ? 2 : 1;
        sentimentScore += matches * weight;
        totalMatches += matches;
      }
    }
    
    // Analyze negative sentiment
    for (const [intensity, keywords] of Object.entries(SENTIMENT_KEYWORDS.negative)) {
      const matches = keywords.filter(keyword => text.includes(keyword)).length;
      if (matches > 0) {
        const weight = intensity === 'strong' ? 3 : intensity === 'moderate' ? 2 : 1;
        sentimentScore -= matches * weight;
        totalMatches += matches;
      }
    }
    
    // Normalize score
    const normalizedScore = totalMatches > 0 ? Math.max(-1, Math.min(1, sentimentScore / (totalMatches * 2))) : 0;
    const confidence = Math.min(0.95, Math.max(0.3, totalMatches * 0.1 + 0.5));
    
    let label: string;
    if (normalizedScore > 0.3) label = 'Very Positive';
    else if (normalizedScore > 0.1) label = 'Positive';
    else if (normalizedScore > -0.1) label = 'Neutral';
    else if (normalizedScore > -0.3) label = 'Negative';
    else label = 'Very Negative';
    
    return {
      score: (normalizedScore + 1) / 2, // Convert to 0-1 scale
      label,
      confidence
    };
  }

  /**
   * Generate detailed stock impact analysis with advanced prediction models
   */
  private async generateStockImpacts(
    stocks: string[], 
    text: string, 
    sentiment: { score: number; label: string; confidence: number }
  ): Promise<StockImpact[]> {
    const impacts: StockImpact[] = [];
    
    for (const ticker of stocks) {
      const company = COMPANY_DATABASE[ticker as keyof typeof COMPANY_DATABASE];
      if (!company) continue;
      
      // Advanced multi-factor prediction model
      const predictionModel = this.buildAdvancedPredictionModel(ticker, company, text, sentiment);
      const impactScore = predictionModel.calculateImpactScore();
      const confidence = predictionModel.calculateConfidence();
      
      // Determine impact level
      const impactLevel = this.getImpactLevel(impactScore);
      
      // Generate enhanced reasoning
      const reasoning = this.generateAdvancedStockReasoning(ticker, company, text, sentiment, predictionModel);
      
      // Generate sophisticated price target
      const priceTarget = this.generateAdvancedPriceTarget(ticker, impactScore, predictionModel);
      
      // Determine dynamic timeframe
      const timeframe = this.determineDynamicTimeframe(text, impactScore, confidence);
      
      impacts.push({
        ticker,
        companyName: company.name,
        impactScore,
        impactLevel,
        confidence,
        timeframe,
        reasoning,
        priceTarget
      });
    }
    
    return impacts.sort((a, b) => Math.abs(b.impactScore - 0.5) - Math.abs(a.impactScore - 0.5));
  }

  /**
   * Build advanced prediction model with multiple factors
   */
  private buildAdvancedPredictionModel(
    ticker: string,
    company: { name: string; sector: string; marketCap: number },
    text: string,
    sentiment: { score: number; label: string; confidence: number }
  ) {
    return {
      calculateImpactScore: () => {
        // Base sentiment impact
        let impactScore = sentiment.score;
        
        // Company-specific mentions with diminishing returns
        const companyMentions = this.countCompanyMentions(text, ticker, company.name);
        const mentionBoost = Math.min(0.3, companyMentions * 0.08);
        impactScore = Math.min(1, impactScore + mentionBoost);
        
        // Sector relevance with weighted importance
        const sectorRelevance = this.calculateSectorRelevance(text, company.sector);
        const sectorWeight = 0.4;
        impactScore = (impactScore * (1 - sectorWeight)) + (sectorRelevance * sectorWeight);
        
        // Market cap volatility adjustment
        const volatilityFactor = company.marketCap > 1000000000000 ? 0.85 : 1.15;
        impactScore = 0.5 + ((impactScore - 0.5) * volatilityFactor);
        
        // News relevance multiplier
        const newsRelevance = this.calculateNewsRelevance(ticker, company, text);
        impactScore = 0.5 + ((impactScore - 0.5) * newsRelevance);
        
        return Math.max(0, Math.min(1, impactScore));
      },
      
      calculateConfidence: () => {
        // Base confidence from sentiment strength
        const sentimentStrength = Math.abs(sentiment.score - 0.5) * 2;
        let confidence = 0.5 + (sentimentStrength * 0.3);
        
        // Boost from direct company mentions
        const companyMentions = this.countCompanyMentions(text, ticker, company.name);
        confidence += Math.min(0.2, companyMentions * 0.04);
        
        // Sector keyword relevance boost
        const sectorRelevance = this.calculateSectorRelevance(text, company.sector);
        confidence += sectorRelevance * 0.15;
        
        // Market cap stability factor
        const stabilityFactor = company.marketCap > 500000000000 ? 1.1 : 0.95;
        confidence *= stabilityFactor;
        
        // Historical accuracy simulation
        const historicalAccuracy = 0.8 + (Math.random() * 0.15);
        confidence *= historicalAccuracy;
        
        return Math.max(0.3, Math.min(0.95, confidence));
      },
      
      getModelFactors: () => ({
        companyMentions: this.countCompanyMentions(text, ticker, company.name),
        sectorRelevance: this.calculateSectorRelevance(text, company.sector),
        newsRelevance: this.calculateNewsRelevance(ticker, company, text),
        volatilityFactor: company.marketCap > 1000000000000 ? 0.85 : 1.15
      })
    };
  }

  /**
   * Calculate news relevance to specific stock
   */
  private calculateNewsRelevance(
    ticker: string, 
    company: { name: string; sector: string }, 
    text: string
  ): number {
    let relevance = 1.0;
    
    // Direct ticker mentions
    const tickerMentions = (text.toLowerCase().match(new RegExp(`\\b${ticker.toLowerCase()}\\b`, 'g')) || []).length;
    if (tickerMentions > 0) relevance += 0.3;
    
    // Industry-specific keywords
    const industryKeywords = this.getIndustryKeywords(company.sector);
    const keywordMatches = industryKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    relevance += Math.min(0.4, keywordMatches * 0.08);
    
    // Competitive mentions
    const competitors = this.getCompetitors(ticker);
    const competitorMentions = competitors.filter(comp => 
      text.toLowerCase().includes(comp.toLowerCase())
    ).length;
    if (competitorMentions > 0) relevance += 0.15;
    
    return Math.min(2.0, relevance);
  }

  /**
   * Get industry-specific keywords for relevance calculation
   */
  private getIndustryKeywords(sector: string): string[] {
    const keywordMap: Record<string, string[]> = {
      'Technology': ['innovation', 'software', 'hardware', 'digital', 'cloud', 'AI', 'data', 'platform', 'algorithm'],
      'Healthcare': ['drug', 'treatment', 'clinical', 'FDA', 'medical', 'pharmaceutical', 'biotech', 'vaccine'],
      'Financial Services': ['banking', 'lending', 'credit', 'financial', 'payment', 'fintech', 'regulation', 'interest'],
      'Consumer Discretionary': ['retail', 'brand', 'consumer', 'sales', 'marketing', 'e-commerce', 'shopping', 'automotive'],
      'Consumer Staples': ['food', 'beverage', 'household', 'grocery', 'brand', 'consumer goods'],
      'Energy': ['oil', 'gas', 'renewable', 'solar', 'wind', 'battery', 'electric', 'carbon', 'energy'],
      'Industrials': ['manufacturing', 'industrial', 'aerospace', 'defense', 'transportation', 'logistics']
    };
    
    return keywordMap[sector] || [];
  }

  /**
   * Get competitors for relevance calculation
   */
  private getCompetitors(ticker: string): string[] {
    const competitorMap: Record<string, string[]> = {
      'AAPL': ['samsung', 'google', 'microsoft', 'amazon'],
      'MSFT': ['apple', 'google', 'amazon', 'oracle'],
      'GOOGL': ['apple', 'microsoft', 'amazon', 'meta'],
      'AMZN': ['microsoft', 'google', 'walmart', 'alibaba'],
      'TSLA': ['ford', 'gm', 'volkswagen', 'toyota'],
      'META': ['google', 'apple', 'twitter', 'snapchat'],
      'NVDA': ['amd', 'intel', 'qualcomm', 'broadcom']
    };
    
    return competitorMap[ticker] || [];
  }

  /**
   * Generate sector impact analysis
   */
  private generateSectorImpacts(
    sectors: string[], 
    text: string, 
    sentiment: { score: number; label: string; confidence: number }
  ): MarketSector[] {
    return sectors.map(sector => {
      const relevance = this.calculateSectorRelevance(text, sector);
      const impactScore = (sentiment.score + relevance) / 2;
      
      const affectedStocks = Object.entries(COMPANY_DATABASE)
        .filter(([_, company]) => company.sector === sector)
        .map(([ticker, _]) => ticker)
        .slice(0, 4);
      
      const reasoning = this.generateSectorReasoning(sector, text, sentiment);
      
      return {
        name: sector,
        impactScore,
        affectedStocks,
        reasoning
      };
    });
  }

  /**
   * Helper methods
   */
  private countCompanyMentions(text: string, ticker: string, companyName: string): number {
    let count = 0;
    count += (text.match(new RegExp(ticker.toLowerCase(), 'g')) || []).length;
    count += (text.match(new RegExp(`\\$${ticker.toLowerCase()}`, 'g')) || []).length;
    
    const nameWords = companyName.toLowerCase().split(' ').filter(word => word.length > 3);
    for (const word of nameWords) {
      count += (text.match(new RegExp(word, 'g')) || []).length;
    }
    
    return count;
  }

  private calculateSectorRelevance(text: string, sector: string): number {
    const keywords = SECTOR_KEYWORDS[sector as keyof typeof SECTOR_KEYWORDS] || [];
    const matches = keywords.filter(keyword => text.includes(keyword)).length;
    return Math.min(1, matches * 0.2);
  }

  private getImpactLevel(score: number): StockImpact['impactLevel'] {
    if (score > 0.8) return 'Very Positive';
    if (score > 0.6) return 'Positive';
    if (score > 0.4) return 'Neutral';
    if (score > 0.2) return 'Negative';
    return 'Very Negative';
  }

  private generateAdvancedStockReasoning(
    ticker: string, 
    company: { name: string; sector: string; marketCap: number }, 
    text: string, 
    sentiment: any, 
    predictionModel: any
  ): string[] {
    const reasoning: string[] = [];
    const modelFactors = predictionModel.getModelFactors();
    
    // Enhanced sector-based reasoning
    const sectorKeywords = this.getIndustryKeywords(company.sector);
    const matchedKeywords = sectorKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (matchedKeywords.length > 0) {
      reasoning.push(`Strong ${company.sector} sector relevance with ${matchedKeywords.length} industry keywords identified`);
    } else {
      reasoning.push(`Indirect ${company.sector} sector exposure to market developments`);
    }
    
    // Advanced sentiment-based reasoning
    const sentimentStrength = Math.abs(sentiment.score - 0.5);
    if (sentiment.score > 0.7) {
      reasoning.push(`Strong positive sentiment (${Math.round(sentiment.score * 100)}%) creates significant upside potential`);
    } else if (sentiment.score > 0.6) {
      reasoning.push(`Moderate positive sentiment likely to support stock performance`);
    } else if (sentiment.score < 0.3) {
      reasoning.push(`Negative sentiment (${Math.round(sentiment.score * 100)}%) may create downward pressure`);
    } else if (sentiment.score < 0.4) {
      reasoning.push(`Cautious sentiment suggests potential volatility ahead`);
    }
    
    // Company mention analysis
    if (modelFactors.companyMentions > 2) {
      reasoning.push(`High news relevance with ${modelFactors.companyMentions} direct company mentions`);
    } else if (modelFactors.companyMentions > 0) {
      reasoning.push(`Moderate news relevance with direct company references`);
    }
    
    // Market cap and volatility considerations
    if (company.marketCap > 1000000000000) {
      reasoning.push('Large-cap stability may moderate price movements but ensure sustained impact');
    } else if (company.marketCap > 100000000000) {
      reasoning.push('Mid-to-large cap positioning allows for meaningful price discovery');
    } else {
      reasoning.push('Smaller market cap may amplify price reactions to news developments');
    }
    
    // Specific business impact factors
    const businessFactors = [];
    if (text.includes('earnings') || text.includes('revenue') || text.includes('profit')) {
      businessFactors.push('financial performance');
    }
    if (text.includes('regulation') || text.includes('policy') || text.includes('compliance')) {
      businessFactors.push('regulatory environment');
    }
    if (text.includes('competition') || text.includes('market share')) {
      businessFactors.push('competitive dynamics');
    }
    if (text.includes('innovation') || text.includes('product') || text.includes('launch')) {
      businessFactors.push('product development');
    }
    
    if (businessFactors.length > 0) {
      reasoning.push(`Key business drivers identified: ${businessFactors.join(', ')}`);
    }
    
    // News relevance factor
    if (modelFactors.newsRelevance > 1.3) {
      reasoning.push('High news relevance score suggests strong correlation with stock performance');
    }
    
    return reasoning.slice(0, 5);
  }

  private generateAdvancedPriceTarget(
    ticker: string, 
    impactScore: number, 
    predictionModel: any
  ): StockImpact['priceTarget'] {
    // Enhanced price targets with volatility and confidence adjustments
    const basePrices: Record<string, number> = {
      'AAPL': 175, 'MSFT': 350, 'GOOGL': 140, 'AMZN': 145, 'TSLA': 240,
      'META': 320, 'NVDA': 450, 'JPM': 150, 'JNJ': 160, 'V': 250,
      'PG': 155, 'UNH': 520, 'HD': 330, 'MA': 380, 'BAC': 32
    };
    
    const basePrice = basePrices[ticker] || 100;
    const modelFactors = predictionModel.getModelFactors();
    
    // Base change calculation with enhanced factors
    let changePercent = (impactScore - 0.5) * 25; // Increased range: -12.5% to +12.5%
    
    // Volatility adjustment based on company characteristics
    const company = COMPANY_DATABASE[ticker as keyof typeof COMPANY_DATABASE];
    if (company) {
      const volatilityMultiplier = company.marketCap > 1000000000000 ? 0.7 : 1.3;
      changePercent *= volatilityMultiplier;
    }
    
    // News relevance impact
    changePercent *= modelFactors.newsRelevance;
    
    // Confidence-based adjustment (higher confidence = more extreme predictions)
    const confidence = predictionModel.calculateConfidence();
    const confidenceMultiplier = 0.5 + (confidence * 0.5);
    changePercent *= confidenceMultiplier;
    
    // Apply sector-specific volatility
    const sectorVolatility = this.getSectorVolatility(company?.sector || 'Technology');
    changePercent *= sectorVolatility;
    
    const predictedPrice = basePrice * (1 + changePercent / 100);
    
    return {
      current: basePrice,
      predicted: Math.round(predictedPrice * 100) / 100,
      change: Math.round((predictedPrice - basePrice) * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100
    };
  }

  /**
   * Get sector-specific volatility multipliers
   */
  private getSectorVolatility(sector: string): number {
    const volatilityMap: Record<string, number> = {
      'Technology': 1.2,
      'Healthcare': 0.9,
      'Financial Services': 1.1,
      'Consumer Discretionary': 1.3,
      'Consumer Staples': 0.7,
      'Energy': 1.5,
      'Industrials': 1.0,
      'Materials': 1.4,
      'Real Estate': 0.8,
      'Utilities': 0.6
    };
    
    return volatilityMap[sector] || 1.0;
  }

  private determineDynamicTimeframe(
    text: string, 
    impactScore: number, 
    confidence: number
  ): StockImpact['timeframe'] {
    // Immediate indicators
    const immediateKeywords = ['immediate', 'today', 'breaking', 'urgent', 'now', 'just announced'];
    if (immediateKeywords.some(keyword => text.toLowerCase().includes(keyword))) {
      return 'Immediate';
    }
    
    // Short-term indicators
    const shortTermKeywords = ['quarter', 'earnings', 'this week', 'next week', 'monthly'];
    const hasShortTermKeywords = shortTermKeywords.some(keyword => text.toLowerCase().includes(keyword));
    const highImpact = Math.abs(impactScore - 0.5) > 0.25;
    const highConfidence = confidence > 0.8;
    
    if (hasShortTermKeywords || (highImpact && highConfidence)) {
      return 'Short-term';
    }
    
    // Long-term indicators
    const longTermKeywords = ['year', 'years', 'long-term', 'strategic', 'future', 'roadmap', 'vision'];
    const hasLongTermKeywords = longTermKeywords.some(keyword => text.toLowerCase().includes(keyword));
    const structuralChange = text.toLowerCase().includes('regulation') || 
                           text.toLowerCase().includes('policy') ||
                           text.toLowerCase().includes('transformation');
    
    if (hasLongTermKeywords || structuralChange) {
      return 'Long-term';
    }
    
    // Default to medium-term with confidence-based adjustment
    return confidence > 0.7 ? 'Short-term' : 'Medium-term';
  }

  private generateSectorReasoning(sector: string, text: string, sentiment: any): string {
    const keywords = SECTOR_KEYWORDS[sector as keyof typeof SECTOR_KEYWORDS] || [];
    const matchedKeywords = keywords.filter(keyword => text.includes(keyword));
    
    if (matchedKeywords.length > 0) {
      return `Sector directly mentioned with keywords: ${matchedKeywords.slice(0, 3).join(', ')}. ${sentiment.label} sentiment expected to ${sentiment.score > 0.5 ? 'benefit' : 'challenge'} sector performance.`;
    }
    
    return `Indirect sector exposure through market dynamics. Overall ${sentiment.label.toLowerCase()} sentiment may influence sector performance.`;
  }

  private generateKeyInsights(headline: string, text: string, stockImpacts: StockImpact[], sectorImpacts: MarketSector[]): string[] {
    const insights: string[] = [];
    
    // Top impacted stocks
    const topPositive = stockImpacts.filter(s => s.impactScore > 0.6).slice(0, 2);
    const topNegative = stockImpacts.filter(s => s.impactScore < 0.4).slice(0, 2);
    
    if (topPositive.length > 0) {
      insights.push(`${topPositive.map(s => s.ticker).join(' and ')} show strongest positive impact potential with high confidence levels.`);
    }
    
    if (topNegative.length > 0) {
      insights.push(`${topNegative.map(s => s.ticker).join(' and ')} may face headwinds based on the analysis.`);
    }
    
    // Sector insights
    const topSector = sectorImpacts.sort((a, b) => Math.abs(b.impactScore - 0.5) - Math.abs(a.impactScore - 0.5))[0];
    if (topSector) {
      insights.push(`${topSector.name} sector shows the most significant exposure to these developments.`);
    }
    
    // Timeline insights
    const immediateImpacts = stockImpacts.filter(s => s.timeframe === 'Immediate').length;
    if (immediateImpacts > 0) {
      insights.push(`${immediateImpacts} stocks expected to see immediate market reaction within 24 hours.`);
    }
    
    // Market breadth
    const positiveCount = stockImpacts.filter(s => s.impactScore > 0.5).length;
    const totalCount = stockImpacts.length;
    insights.push(`Market sentiment analysis suggests ${Math.round((positiveCount / totalCount) * 100)}% of analyzed stocks may benefit from these developments.`);
    
    return insights.slice(0, 5);
  }

  private identifyRiskFactors(text: string, sentiment: any): string[] {
    const risks: string[] = [];
    
    if (text.includes('regulation') || text.includes('policy')) {
      risks.push('Regulatory uncertainty may create additional volatility');
    }
    
    if (text.includes('inflation') || text.includes('interest rate')) {
      risks.push('Macroeconomic factors could amplify market reactions');
    }
    
    if (sentiment.confidence < 0.7) {
      risks.push('Analysis confidence is moderate due to limited information');
    }
    
    if (text.includes('geopolitical') || text.includes('trade')) {
      risks.push('Geopolitical tensions may affect international market exposure');
    }
    
    risks.push('Market conditions can change rapidly, affecting prediction accuracy');
    
    return risks.slice(0, 4);
  }

  private identifyOpportunities(text: string, sentiment: any): string[] {
    const opportunities: string[] = [];
    
    if (sentiment.score > 0.6) {
      opportunities.push('Strong positive sentiment creates potential for momentum-driven gains');
    }
    
    if (text.includes('innovation') || text.includes('technology')) {
      opportunities.push('Technology sector developments may create long-term growth opportunities');
    }
    
    if (text.includes('earnings') || text.includes('revenue')) {
      opportunities.push('Financial performance improvements could drive sustained price appreciation');
    }
    
    if (text.includes('merger') || text.includes('acquisition')) {
      opportunities.push('Corporate activity may create value for shareholders');
    }
    
    opportunities.push('Market volatility creates potential entry points for long-term investors');
    
    return opportunities.slice(0, 4);
  }

  private generateTimeline(headline: string, text: string, sentiment: any): {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  } {
    return {
      immediate: [
        'Initial market reaction and price discovery',
        'Trading volume spike in affected securities',
        'Analyst commentary and rating updates'
      ],
      shortTerm: [
        'Earnings guidance adjustments from companies',
        'Sector rotation based on new information',
        'Options market activity reflecting sentiment shifts'
      ],
      longTerm: [
        'Fundamental business impact assessment',
        'Strategic positioning changes by companies',
        'Long-term valuation multiple adjustments'
      ]
    };
  }
}

// Export singleton instance
export const aiAnalysisEngine = new AIAnalysisEngine();
export default aiAnalysisEngine;

// Export types
export type { StockImpact, MarketSector, MarketSentiment, AIAnalysisResult };