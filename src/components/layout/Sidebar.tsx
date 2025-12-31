"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Home, Code2, Sun, Wallet, Menu, Moon, Sun as SunIcon, Shield } from 'lucide-react';

const routes = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'EVM Decoder', path: '/evm/tx-decoder', icon: Code2 },
  { name: 'Solana Decoder', path: '/sol/tx-decoder', icon: Sun },
  { name: 'Wallet Generator', path: '/wallet/wallet-generator', icon: Wallet },
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check initial theme
      if (document.documentElement.classList.contains('dark')) {
        setIsDark(true);
      } else {
        // Default to dark mode if not set (based on previous logic)
        document.documentElement.classList.add('dark');
        setIsDark(true);
      }
    }
  }, []);

  const toggleDarkMode = () => {
    if (typeof document !== 'undefined') {
      const nowDark = !document.documentElement.classList.contains('dark');
      document.documentElement.classList.toggle('dark', nowDark);
      setIsDark(nowDark);
    }
  };

  const NavContent = () => (
    <div className="flex flex-col h-full py-4">
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 px-4 mb-6">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-bold tracking-tight">Dev Tools</h2>
        </div>
        <div className="space-y-1">
          {routes.map((route) => (
            <Button
              key={route.path}
              variant={pathname === route.path ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                pathname === route.path && "bg-secondary"
              )}
              asChild
              onClick={() => setIsOpen(false)}
            >
              <Link href={route.path}>
                <route.icon className="h-4 w-4" />
                {route.name}
              </Link>
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-auto px-3 py-2">
        <Separator className="my-4" />
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={toggleDarkMode}
        >
          {isDark ? (
            <>
              <Moon className="h-4 w-4" />
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <SunIcon className="h-4 w-4" />
              <span>Light Mode</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={cn("hidden md:flex flex-col w-64 border-r bg-card text-card-foreground h-screen sticky top-0", className)}>
        <ScrollArea className="flex-1">
          <NavContent />
        </ScrollArea>
      </div>
    </>
  );
}

