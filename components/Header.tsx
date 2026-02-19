import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 p-4 bg-black/50 backdrop-blur-sm border-b border-zinc-700">
      <div className="container mx-auto flex items-center justify-center">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <h1 className="text-xl font-semibold text-zinc-100 tracking-wider">
          MarketReels
        </h1>
      </div>
    </header>
  );
};

export default Header;