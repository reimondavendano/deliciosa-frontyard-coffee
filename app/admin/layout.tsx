'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/Header';
import { ToastProvider } from '@/components/admin/Toast';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Skip auth check for login page
        if (pathname === '/admin/login') {
            setIsLoading(false);
            return;
        }

        // Check if user is logged in
        const user = localStorage.getItem('admin_user');
        if (!user) {
            router.push('/admin/login');
        } else {
            setIsLoading(false);
        }
    }, [pathname, router]);

    // Show login page without layout
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-rustic-blue border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <ToastProvider>
            <div className="min-h-screen bg-gray-100 flex">
                <AdminSidebar />
                <div className="flex-1 flex flex-col lg:ml-0">
                    <AdminHeader />
                    <main className="flex-1 p-6 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </ToastProvider>
    );
}
