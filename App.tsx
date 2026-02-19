import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NewsItem } from './types';
import { fetchStockNews, generateNewsImage } from './services/geminiService';
import NewsPost from './components/NewsPost';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [newsFeed, setNewsFeed] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const initialLoadDone = useRef(false);

  const loadNews = useCallback(async () => {
    if (isFetchingMore) return;
    
    setIsFetchingMore(true);
    setError(null);
    try {
      const newNewsItems = await fetchStockNews(5);
      const itemsWithLoadingState = newNewsItems.map(item => ({
        ...item,
        id: `${item.ticker}-${Math.random()}`,
        imageUrl: '',
        imageIsLoading: true,
      }));

      setNewsFeed(prevFeed => [...prevFeed, ...itemsWithLoadingState]);

      itemsWithLoadingState.forEach(async (item) => {
        try {
          const imageUrl = await generateNewsImage(item.imagePrompt);
          setNewsFeed(prevFeed =>
            prevFeed.map(feedItem =>
              feedItem.id === item.id
                ? { ...feedItem, imageUrl, imageIsLoading: false }
                : feedItem
            )
          );
        } catch (imgError) {
          console.error(`Failed to generate image for ${item.ticker}:`, imgError);
          setNewsFeed(prevFeed =>
            prevFeed.map(feedItem =>
              feedItem.id === item.id
                ? { ...feedItem, imageIsLoading: false, imageUrl: 'https://picsum.photos/seed/error/1280/720' } // Fallback image 16:9
                : feedItem
            )
          );
        }
      });

    } catch (err) {
      setError('Failed to fetch stock news. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [isFetchingMore]);


  useEffect(() => {
    if (!initialLoadDone.current) {
        loadNews();
        initialLoadDone.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = useCallback(() => {
    if (feedContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = feedContainerRef.current;
      // Fetch more when user is near the bottom of the page
      if (scrollHeight - scrollTop - clientHeight < 500 && !isFetchingMore) {
        loadNews();
      }
    }
  }, [isFetchingMore, loadNews]);

  useEffect(() => {
    const feedElement = feedContainerRef.current;
    if (feedElement) {
      feedElement.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (feedElement) {
        feedElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

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
            {newsFeed.map((item) => (
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