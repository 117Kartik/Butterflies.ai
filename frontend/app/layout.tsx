import './globals.css';
import type { Metadata } from 'next';
import ThemeInitializer from '@/components/theme-initializer';
export const metadata: Metadata = { title: 'Butterflies.ai | Meeting intelligence', description: 'Meeting intelligence that works for you.' };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body><ThemeInitializer/>{children}</body></html>; }
