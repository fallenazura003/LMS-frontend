'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { Button } from '@/components/ui/button';

export default function Header() {
    const router = useRouter();
    const { logout, role } = useAuth();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const handleLogoClick = () => {
        if (role === 'ADMIN') router.push('/admin/dashboard');
        else if (role === 'TEACHER') router.push('/teacher/home');
        else if (role === 'STUDENT') router.push('/student/home');
        else router.push('/');
    };

    return (
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
            <h1
                className="text-xl font-bold text-blue-600 cursor-pointer"
                onClick={handleLogoClick} // 👈 Xử lý chuyển trang theo role
            >
                AI Learning
            </h1>
            <div className="flex items-center gap-4">
                {role && (
                    <>
                        <span className="text-sm text-gray-600">{role}</span>
                        <Button onClick={handleLogout} variant="outline">
                            Đăng xuất
                        </Button>
                    </>
                )}
            </div>
        </header>
    );
}
