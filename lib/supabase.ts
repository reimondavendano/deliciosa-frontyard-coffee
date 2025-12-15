import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types based on schema
export type UserRole = 'admin' | 'customer';
export type MenuCategory = 'coffee' | 'non-coffee' | 'pastry';
export type GalleryCategory = 'events' | 'operations';
export type PackageCategory = 'coffee cart' | 'pastry cart' | 'combination';
export type InquiryStatus = 'new' | 'read' | 'archived';

export interface User {
    id: string;
    email: string;
    password: string;
    role: UserRole;
    first_name: string | null;
    last_name: string | null;
    created_at: string;
    updated_at: string;
}

export interface Banner {
    id: string;
    title: string | null;
    description: string | null;
    image: string;
    link_url: string | null;
    order: number;
    is_active: boolean;
    created_at: string;
}

export interface WeeklyInspiration {
    id: string;
    title: string;
    quote: string;
    reference: string | null;
    image: string | null;
    is_active: boolean;
    created_at: string;
}

export interface MenuItem {
    id: string;
    name: string;
    description: string | null;
    price: number;
    category: MenuCategory;
    image: string | null;
    is_available: boolean;
    created_at: string;
}

export interface GalleryItem {
    id: string;
    title: string | null;
    description: string | null;
    image: string;
    category: GalleryCategory;
    created_at: string;
}

export interface Package {
    id: string;
    name: string;
    description: string | null;
    price: number | null;
    category: PackageCategory;
    image: string | null;
    inclusions: string[] | null;
    is_active: boolean;
    created_at: string;
}

export interface Inquiry {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    event_date: string | null;
    message: string | null;
    status: InquiryStatus;
    created_at: string;
}

// Storage bucket name
export const STORAGE_BUCKET = 'deliciosa-assets';

// Storage folder names
export const STORAGE_FOLDERS = {
    banners: 'banner',
    weeklyInspirations: 'weekly-inspiration',
    menu: 'menu',
    gallery: 'gallery',
    packages: 'packages',
} as const;
