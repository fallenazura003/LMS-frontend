// app/layout.tsx
import '@/styles/globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/store/auth';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/SideBar";

import { Toaster } from '@/components/ui/toaster'; // Nếu bạn dùng shadcn/ui toast

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'AI Learning Platform',
    description: 'Nền tảng học tập hiện đại với AI.',
};

export default function RootLayout({ children }: { children : ReactNode }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <AuthProvider>
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Header />
                {/* Main content area: Sidebar + Page Content */}
                <div className="flex flex-1"> {/* flex-1 để chiếm hết chiều cao còn lại */}
                    <Sidebar /> {/* Sidebar sẽ hiển thị cố định bên trái */}
                    <main className="flex-1 px-4 md:px-8 lg:px-16 pt-6 pb-24 overflow-y-auto"> {/* overflow-y-auto nếu nội dung dài */}
                        {children}
                    </main>
                </div>
                <Footer />
            </div>
            <Toaster />
        </AuthProvider>
        </body>
        </html>
    );
}