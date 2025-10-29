"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const routes = [
  { name: 'Home', path: '/' },
  { name: 'EVM Transaction Decoder', path: '/evm/tx-decoder' },
  { name: 'Solana Transaction Decoder', path: '/sol/tx-decoder' },
];

export default function Sidebar() {
  const pathname = usePathname();
  // 只用于按钮显示，不用于 className 判断
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (typeof document !== 'undefined') {
      const nowDark = !document.documentElement.classList.contains('dark');
      document.documentElement.classList.toggle('dark', nowDark);
      setIsDark(nowDark);
    }
  };

  return (
  <nav className="flex flex-col w-56 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="flex-1 py-8 px-2">
        <ul className="space-y-4">
          {routes.map((route) => (
            <li key={route.path}>
              <Link href={route.path}>
                <span className={`block px-2 py-2 rounded-lg cursor-pointer transition-colors font-medium text-sm ${pathname === route.path ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{route.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-4 pb-8">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-yellow-300"
        >
          {isDark ? (
            <span>🌙 Dark Mode</span>
          ) : (
            <span>☀️ Light Mode</span>
          )}
        </button>
      </div>
    </nav>
  );
}
