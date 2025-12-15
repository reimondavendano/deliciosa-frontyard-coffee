'use client';

import { Bell, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface User {
    first_name: string | null;
    last_name: string | null;
}

export default function AdminHeader() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('admin_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Search Bar */}
                <div className="flex-1 max-w-md hidden md:block">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4 ml-auto lg:ml-0">
                    {/* Notifications */}
                    <button className="relative p-2 text-gray-500 hover:text-rustic-blue hover:bg-gray-100 rounded-lg transition-all">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-rust rounded-full"></span>
                    </button>

                    {/* User Avatar */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-rustic-blue rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {user?.first_name?.[0] || 'A'}
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-medium text-gray-800">
                                {user?.first_name || 'Admin'}
                            </p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
