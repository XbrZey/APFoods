import React from 'react';

export default function FooterContact() {
  return (
    <footer className="w-full border-t border-neutral-100 bg-neutral-50/50 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-neutral-400">
        <div>
          <span className="font-bold text-neutral-700">Foodie</span> © {new Date().getFullYear()}. Designed Minimalist style.
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-orange-500 transition-colors">Privacy</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Terms</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}