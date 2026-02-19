
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

export interface RawNewsItem {
    headline: string;
    ticker: string;
    summary: string;
    sentiment: 'Positive' | 'Negative' | 'Neutral';
    sentimentScore: number;
    sourceUrl: string;
    imagePrompt: string;
}