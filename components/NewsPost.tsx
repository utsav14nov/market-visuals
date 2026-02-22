import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    NewsItem
} from '../types';

const NewsPost: React.FC < {
    item: NewsItem
} > = ({
    item
}) => {
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        if (isFullScreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isFullScreen]);

    const getSentimentClass = (sentiment: string) => {
        switch (sentiment) {
            case 'Positive':
                return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'Negative':
                return 'bg-red-500/20 text-red-300 border-red-500/30';
            default:
                return 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30';
        }
    };

    return (
        <>
        <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-lg">
            { /* Image Section - Square aspect for maximum mobile display, tappable for full screen */ }
            <div
                role="button"
                tabIndex={0}
                onClick={() => item.imageUrl && setIsFullScreen(true)}
                onKeyDown={(e) => item.imageUrl && (e.key === 'Enter' || e.key === ' ') && setIsFullScreen(true)}
                aria-label="View post full screen"
                className="aspect-square w-full relative bg-zinc-800 overflow-hidden cursor-pointer active:opacity-95"
            >
                {item.imageIsLoading && (
                    <div className="absolute inset-0 w-full h-full bg-zinc-800 animate-pulse"></div>
                )}
                {item.imageUrl && (
                    <img
                        src={item.imageUrl}
                        alt={item.headline}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${!item.imageIsLoading ? 'opacity-100' : 'opacity-0'}`}
                        draggable={false}
                    />
                )}
            </div>
            
            { /* Action Bar - Compact for mobile */ }
            <div className="flex items-center justify-between px-2 py-1.5 border-y border-zinc-800">
                <div className="flex items-center space-x-3">
                     <button aria-label="Like post" className="text-zinc-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                    <button aria-label="Comment on post" className="text-zinc-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </button>
                    <button aria-label="Share post" className="text-zinc-400 hover:text-white transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                    </button>
                </div>
                 <button aria-label="Bookmark post" className="text-zinc-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                </button>
            </div>
            
            { /* Content Section - Minimal for mobile */ }
            <div className="px-2 py-1.5">
                <p className="font-bold text-[10px] text-zinc-400 mb-0.5">{item.ticker}</p>
                <h2 className="text-sm font-bold text-zinc-100 leading-tight mb-1.5 line-clamp-2">
                    {item.headline}
                </h2>
                <div className="flex items-center justify-between gap-2">
                    <span className={`inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded border ${getSentimentClass(item.sentiment)}`}>
                        {item.sentiment.toUpperCase()}: {(item.sentimentScore * 100).toFixed(0)}%
                    </span>
                    <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-green-400 hover:text-green-300 transition-colors whitespace-nowrap">
                        Read More →
                    </a>
                </div>
            </div>
        </div>

        { /* Full-screen overlay via portal - covers entire screen including header */ }
        {isFullScreen && createPortal(
            <div
                className="fixed inset-0 bg-black flex flex-col"
                style={{ height: '100dvh', maxHeight: '100dvh', zIndex: 9999, top: 0, left: 0, right: 0, bottom: 0 }}
            >
                <button
                    type="button"
                    onClick={() => setIsFullScreen(false)}
                    aria-label="Close full screen"
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div
                    className="flex-1 min-h-0 flex flex-col overflow-hidden"
                    onClick={(e) => e.target === e.currentTarget && setIsFullScreen(false)}
                >
                    { /* Image takes most of the screen */ }
                    {item.imageUrl && (
                        <div className="flex-1 min-h-0 flex items-center justify-center bg-black py-2">
                            <img
                                src={item.imageUrl}
                                alt={item.headline}
                                className="w-full h-full object-contain"
                                style={{ maxHeight: '85dvh' }}
                                draggable={false}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}
                    { /* Compact content strip at bottom */ }
                    <div className="flex-shrink-0 px-3 py-2 pb-4 bg-black border-t border-zinc-800 text-zinc-100">
                        <p className="text-[10px] text-zinc-500 mb-0.5">{item.ticker}</p>
                        <h2 className="text-sm font-bold leading-tight mb-1.5 line-clamp-2">
                            {item.headline}
                        </h2>
                        <div className="flex items-center justify-between gap-2">
                            <span className={`inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded border ${getSentimentClass(item.sentiment)}`}>
                                {item.sentiment.toUpperCase()}: {(item.sentimentScore * 100).toFixed(0)}%
                            </span>
                            <a
                                href={item.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-green-400 hover:text-green-300 transition-colors"
                            >
                                Read Article →
                            </a>
                        </div>
                    </div>
                </div>
            </div>,
            document.body
        )}
        </>
    );
};

export default NewsPost;