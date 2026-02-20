import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NewsItem } from './types';
import { fetchStockNews } from './services/newsApiService';
import NewsPost from './components/NewsPost';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [newsFeed, setNewsFeed] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [backendOffset, setBackendOffset] = useState<number>(0);
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const initialLoadDone = useRef(false);

  const loadNews = useCallback(async () => {
    if (import.meta.env.DEV) {
      console.log('Loading news...');
    }
    if (isFetchingMore || !hasMoreData) return;
    
    setIsFetchingMore(true);
    setError(null);
    try {
      const newNewsItems = await fetchStockNews(10, backendOffset);
      
      // If API returns 0 records, we've reached the end
      if (newNewsItems.length === 0) {
        setHasMoreData(false);
        return;
      }
      
      // Next request offset = current offset + number of items returned by backend
      setBackendOffset(prev => prev + newNewsItems.length);
      
      // Filter out items without generated_image before mapping
      const itemsWithIds: NewsItem[] = newNewsItems
        .filter(item => item.generated_image && item.generated_image.trim() !== '')
        .map(item => ({
          id: `news-${item.id}-${Math.random()}`,
          headline: item.title,
          ticker: item.source || 'MARKET', // Use source as ticker fallback
          summary: item.description,
          sentiment: item.sentiment_verdict,
          sentimentScore: item.sentiment_score,
          sourceUrl: item.url,
          imagePrompt: '', // Not needed anymore but keeping for type compatibility
          imageUrl: item.generated_image,
          imageIsLoading: false,
        }));

      setNewsFeed(prevFeed => [...prevFeed, ...itemsWithIds]);
    } catch (err) {
      setError('Failed to fetch stock news. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [isFetchingMore, backendOffset, hasMoreData]);


  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('Initial load...');
    }
    if (!initialLoadDone.current) {
        loadNews();
        initialLoadDone.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = useCallback(() => {
    if (feedContainerRef.current && hasMoreData) {
      const { scrollTop, scrollHeight, clientHeight } = feedContainerRef.current;
      // Fetch more when user is near the bottom of the page
      if (scrollHeight - scrollTop - clientHeight < 500 && !isFetchingMore) {
        loadNews();
      }
    }
  }, [isFetchingMore, loadNews, hasMoreData]);

  useEffect(() => {
    // Only attach scroll listener if there's more data to fetch
    if (!hasMoreData) {
      return;
    }
    
    const feedElement = feedContainerRef.current;
    if (feedElement) {
      feedElement.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (feedElement) {
        feedElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll, hasMoreData]);

  return (
    <div className="bg-black h-screen w-screen overflow-hidden font-sans text-zinc-100">
      <Header />
      {isLoading && newsFeed.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner />
        </div>
      ) : error && newsFeed.length === 0 ? (
        <div className="flex items-center justify-center h-full text-red-400 text-center p-8">
            <p>{error}</p>
        </div>
      ) : (
        <main
          ref={feedContainerRef}
          className="h-full w-full overflow-y-auto pt-20 pb-12"
        >
          <div className="max-w-xl mx-auto px-4 space-y-8">
            {newsFeed
              .filter(item => item.imageUrl && item.imageUrl.trim() !== '')
              .map((item) => (
                <NewsPost key={item.id} item={item} />
              ))}
            {isFetchingMore && (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
};

export default App;