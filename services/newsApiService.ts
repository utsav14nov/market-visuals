import { RawNewsItem } from '../types';

// Get API base URL from environment, with fallback for production
const getApiBaseUrl = (): string => {
  const envUrl = (import.meta as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL;
  
  if (envUrl) {
    return envUrl;
  }
  
  // In production, throw error if API URL is not configured
  if (import.meta.env.PROD) {
    throw new Error('VITE_API_BASE_URL environment variable is required in production');
  }
  
  // Development fallback
  return 'http://localhost:8000';
};

const API_BASE_URL = getApiBaseUrl();

export async function fetchStockNews(count: number, offset:number): Promise<RawNewsItem[]> {
  try {
    const url = new URL('/news', API_BASE_URL);
    url.searchParams.set('limit', String(count));
    url.searchParams.set('skip', String(offset))


    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch news: ${response.status} ${response.statusText}`
      );
    }

    const newsData = await response.json();

    if (!Array.isArray(newsData)) {
      throw new Error('Invalid data format received from API.');
    }

    return newsData as RawNewsItem[];
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error fetching stock news from API:', error);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch news data from the API.');
  }
}
