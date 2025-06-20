'use client';

import Link from 'next/link';
import { useAuth } from '@/store/auth';

export default function NavBar() {
    const { role, logout } = useAuth();

    return (
        <nav className="flex gap-4 items-center">
            {role === 'STUDENT' && <Link href="/student/home">Trang học</Link>}
            {role === 'TEACHER' && <Link href="/teacher/home">Quản lý khóa học</Link>}
            {role === 'ADMIN' && <Link href="/admin/dashboard">Dashboard</Link>}
            {!role && (
                <>
                    <Link href="/login">Đăng nhập</Link>
                    <Link href="/register">Đăng ký</Link>
                </>
            )}
            {role && (
                <button onClick={logout} className="text-red-600 underline">
                    Đăng xuất
                </button>
            )}
        </nav>
    );
}
