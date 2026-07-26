import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Butterflies.ai | Meeting intelligence', description: 'Meeting intelligence that works for you.' };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
