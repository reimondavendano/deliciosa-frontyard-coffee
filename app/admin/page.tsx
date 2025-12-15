'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Image,
    Sparkles,
    Coffee,
    Images,
    Package,
    MessageSquare,
    TrendingUp
} from 'lucide-react';

interface DashboardStats {
    banners: number;
    inspirations: number;
    menuItems: number;
    galleryItems: number;
    packages: number;
    inquiries: number;
    newInquiries: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        banners: 0,
        inspirations: 0,
        menuItems: 0,
        galleryItems: 0,
        packages: 0,
        inquiries: 0,
        newInquiries: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [
                { count: banners },
                { count: inspirations },
                { count: menuItems },
                { count: galleryItems },
                { count: packages },
                { count: inquiries },
                { count: newInquiries },
            ] = await Promise.all([
                supabase.from('banners').select('*', { count: 'exact', head: true }),
                supabase.from('weekly_inspirations').select('*', { count: 'exact', head: true }),
                supabase.from('menu_items').select('*', { count: 'exact', head: true }),
                supabase.from('gallery_items').select('*', { count: 'exact', head: true }),
                supabase.from('packages').select('*', { count: 'exact', head: true }),
                supabase.from('inquiries').select('*', { count: 'exact', head: true }),
                supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
            ]);

            setStats({
                banners: banners || 0,
                inspirations: inspirations || 0,
                menuItems: menuItems || 0,
                galleryItems: galleryItems || 0,
                packages: packages || 0,
                inquiries: inquiries || 0,
                newInquiries: newInquiries || 0,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const statCards = [
        { label: 'Banners', value: stats.banners, icon: Image, color: 'bg-blue-500' },
        { label: 'Inspirations', value: stats.inspirations, icon: Sparkles, color: 'bg-purple-500' },
        { label: 'Menu Items', value: stats.menuItems, icon: Coffee, color: 'bg-amber-500' },
        { label: 'Gallery', value: stats.galleryItems, icon: Images, color: 'bg-green-500' },
        { label: 'Packages', value: stats.packages, icon: Package, color: 'bg-pink-500' },
        { label: 'Inquiries', value: stats.inquiries, icon: MessageSquare, color: 'bg-cyan-500', badge: stats.newInquiries },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-rustic-blue border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-serif font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500">Welcome to Deliciosa Admin Panel</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.label}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                                    <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                                </div>
                                <div className={`${card.color} p-3 rounded-lg relative`}>
                                    <Icon className="w-6 h-6 text-white" />
                                    {card.badge !== undefined && card.badge > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                            {card.badge}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-rustic-blue" />
                    Quick Overview
                </h2>
                <p className="text-gray-500">
                    Manage your website content from the sidebar navigation. Each section allows you to create, edit, and delete entries that will be displayed on the public website.
                </p>
            </div>
        </div>
    );
}
