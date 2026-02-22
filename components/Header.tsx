import React from 'react';

// Logo from public/ - served at root in dev and production build (public/ is copied to dist/)
const logoUrl = '/bullScrollLogo3.png';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 p-4 bg-black/50 backdrop-blur-sm border-b border-zinc-700">
      <div className="container mx-auto relative flex items-center h-8">
        <img
          src={logoUrl}
          alt="Bull scroll"
          className="h-8 w-auto object-contain mix-blend-multiply"
        />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <h1 className="text-xl font-semibold text-zinc-100 tracking-wider">
            Bull scroll
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;