'use client';

import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({
                                           children,
                                           allowedRoles,
                                       }: {
    children: React.ReactNode;
    allowedRoles: string[];
}) {
    const { token, role, status } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!token || !allowedRoles.includes(role || '') || status !== 'ACTIVE') {
            router.replace('/'); // hoặc /login
        }
    }, [token, role, status]);

    if (!token || !allowedRoles.includes(role || '') || status !== 'ACTIVE') return null;

    return <>{children}</>;
}
