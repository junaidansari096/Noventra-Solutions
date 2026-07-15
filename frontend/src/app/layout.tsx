import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Noventra Solutions | Premium Web Design, Hosting & Maintenance",
  description: "Enterprise-grade web designs, scalable cloud hosting, and monthly website maintenance for fast-growing companies.",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Geist:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        {/* Material Symbols */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col antialiased">
        {/* TopAppBar */}
        <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-surface-variant/30 shadow-sm">
          <div className="flex justify-between items-center h-16 px-gutter max-w-container-max mx-auto">
            <Link href="/" className="flex items-center gap-sm group cursor-pointer">
              <span className="material-symbols-outlined text-primary text-[28px] animate-pulse">rocket_launch</span>
              <span className="font-headline-md text-headline-md font-bold tracking-tight text-primary">Noventra</span>
            </Link>
            <nav className="hidden md:flex gap-lg items-center">
              <Link href="/" className="text-on-surface-variant font-semibold hover:text-primary transition-colors py-1">Home</Link>
              <Link href="/services" className="text-on-surface-variant font-medium hover:text-primary transition-colors py-1">Services</Link>
              <Link href="/portfolio" className="text-on-surface-variant font-medium hover:text-primary transition-colors py-1">Portfolio</Link>
              <Link href="/live-demo" className="text-on-surface-variant font-medium hover:text-primary transition-colors py-1">Live Demo</Link>
              <Link href="/blog" className="text-on-surface-variant font-medium hover:text-primary transition-colors py-1">Blog</Link>
              <Link href="/careers" className="text-on-surface-variant font-medium hover:text-primary transition-colors py-1">Careers</Link>
              <Link href="/contact" className="text-on-surface-variant font-medium hover:text-primary transition-colors py-1">Contact</Link>
            </nav>
            <div className="flex items-center gap-md">
              <Link href="/portal" className="text-sm font-semibold text-primary hover:text-primary-container px-3 py-1.5 rounded-lg border border-primary/20 hover:border-primary/50 transition-all">
                Portal
              </Link>
              <Link href="/admin" className="bg-primary-container text-white px-lg py-sm rounded-lg font-label-md hover:opacity-90 active:scale-95 transition-all">
                Dashboard
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow pt-16">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-surface-container-lowest border-t border-outline-variant">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-xl px-gutter py-xxl max-w-container-max mx-auto">
            <div className="space-y-md">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary text-headline-md">rocket_launch</span>
                <span className="text-headline-md font-headline-md font-bold text-primary">Noventra</span>
              </div>
              <p className="font-body-sm text-on-surface-variant">Global leader in enterprise-grade IT solutions and high-performance digital engineering.</p>
            </div>
            <div>
              <h4 className="font-label-md text-on-surface mb-md">Company</h4>
              <ul className="space-y-sm font-body-sm text-on-surface-variant">
                <li><Link href="/careers" className="hover:text-primary transition-all">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-all">Contact Us</Link></li>
                <li><a className="hover:text-primary transition-all" href="#">Newsroom</a></li>
                <li><a className="hover:text-primary transition-all" href="#">Partners</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-label-md text-on-surface mb-md">Solutions</h4>
              <ul className="space-y-sm font-body-sm text-on-surface-variant">
                <li><Link href="/services" className="hover:text-primary transition-all">Services</Link></li>
                <li><Link href="/portfolio" className="hover:text-primary transition-all">Portfolio</Link></li>
                <li><Link href="/live-demo" className="hover:text-primary transition-all">Live Demos</Link></li>
                <li><Link href="/blog" className="hover:text-primary transition-all">Insights</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-label-md text-on-surface mb-md">Contact</h4>
              <ul className="space-y-sm font-body-sm text-on-surface-variant">
                <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[18px]">mail</span> hello@noventra.com</li>
                <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[18px]">call</span> +1 (555) 000-NOVN</li>
                <li><a className="hover:text-primary transition-all" href="#">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-outline-variant px-gutter py-lg max-w-container-max mx-auto text-center font-body-sm text-on-surface-variant/60">
            © {new Date().getFullYear()} Noventra Solutions. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
