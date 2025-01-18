import React from 'react';

export function Footer() {
  return (
    <footer className="bg-[#1E1E1E] border-t border-gray-800 py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-gray-400 text-sm">
          Powered by{' '}
          <a
            href="https://letsthunderbay.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-500 hover:text-purple-400 transition-colors duration-200"
          >
            Let's Thunder Bay
          </a>
        </p>
      </div>
    </footer>
  );
}