
// FIX: Removed a circular self-import of 'NewsItem'.
export interface NewsItem {
    id: string;
    headline: string;
    ticker: string;
    summary: string;
    sentiment: 'Positive' | 'Negative' | 'Neutral';
    sentimentScore: number;
    sourceUrl: string;
    imagePrompt: string;
    imageUrl: string;
    imageIsLoading: boolean;
}

// API Response structure from backend
export interface RawNewsItem {
    api_source: string;
    content: string;
    created_at: string;
    description: string;
    full_content: string;
    generated_image: string;
    gnews_id: string;
    id: number;
    original_image: string;
    published_at: string;
    sentiment_confidence: number;
    sentiment_score: number;
    sentiment_verdict: 'Positive' | 'Negative' | 'Neutral';
    source: string;
    title: string;
    url: string;
}