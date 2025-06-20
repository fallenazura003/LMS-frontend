// app/layout.tsx
import '@/styles/globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/store/auth';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'AI Learning Platform',
    description: 'Learn smarter with AI-assisted courses.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <AuthProvider>
        <Header />
        <main className="min-h-screen px-4 md:px-8 lg:px-16 pt-6 pb-24 bg-gray-50">
            {children}
        </main>
        <Footer />
        </AuthProvider>
        </body>
        </html>
    );
}
