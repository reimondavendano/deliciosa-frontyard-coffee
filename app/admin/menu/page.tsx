'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase, MenuItem, MenuCategory, STORAGE_FOLDERS } from '@/lib/supabase';
import { uploadImage, deleteImage } from '@/lib/upload';
import { useToast } from '@/components/admin/Toast';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Pagination from '@/components/admin/Pagination';
import {
    Plus,
    Pencil,
    Trash2,
    Loader2,
    X,
    Upload,
    Eye,
    EyeOff,
    Coffee,
    Search
} from 'lucide-react';

const MENU_CATEGORIES: { value: MenuCategory; label: string }[] = [
    { value: 'coffee', label: 'Coffee' },
    { value: 'non-coffee', label: 'Non-Coffee' },
    { value: 'pastry', label: 'Pastry' },
];

const ITEMS_PER_PAGE = 8;

export default function MenuPage() {
    const { showToast } = useToast();
    const [items, setItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [filterCategory, setFilterCategory] = useState<MenuCategory | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({ isOpen: false, title: '', message: '', onConfirm: () => { } });

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState<MenuCategory>('coffee');
    const [isAvailable, setIsAvailable] = useState(true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => {
        fetchItems();
    }, []);

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [items, filterCategory, searchQuery]);

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredItems.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredItems, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterCategory]);

    const fetchItems = async () => {
        try {
            const { data, error } = await supabase
                .from('menu_items')
                .select('*')
                .order('category', { ascending: true })
                .order('name', { ascending: true });

            if (error) throw error;
            setItems(data || []);
        } catch (error) {
            console.error('Error fetching menu items:', error);
            showToast('Failed to load menu items', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setPrice('');
        setCategory('coffee');
        setIsAvailable(true);
        setImageFile(null);
        setImagePreview('');
        setEditingItem(null);
    };

    const openModal = (item?: MenuItem) => {
        if (item) {
            setEditingItem(item);
            setName(item.name);
            setDescription(item.description || '');
            setPrice(item.price.toString());
            setCategory(item.category);
            setIsAvailable(item.is_available);
            setImagePreview(item.image || '');
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !price) {
            showToast('Please fill in required fields', 'error');
            return;
        }

        if (editingItem) {
            setConfirmModal({
                isOpen: true,
                title: 'Update Menu Item',
                message: 'Are you sure you want to update this menu item?',
                onConfirm: () => performSave(),
            });
        } else {
            performSave();
        }
    };

    const performSave = async () => {
        setConfirmModal({ ...confirmModal, isOpen: false });
        setIsSaving(true);

        try {
            let imageUrl = editingItem?.image || null;
            const oldImageUrl = editingItem?.image;

            if (imageFile) {
                const uploadedUrl = await uploadImage(imageFile, STORAGE_FOLDERS.menu);
                if (uploadedUrl) imageUrl = uploadedUrl;
            }

            const itemData = {
                name,
                description,
                price: parseFloat(price),
                category,
                image: imageUrl,
                is_available: isAvailable,
            };

            if (editingItem) {
                const { error } = await supabase.from('menu_items').update(itemData).eq('id', editingItem.id);
                if (error) throw error;

                if (imageFile && oldImageUrl && oldImageUrl !== imageUrl) {
                    await deleteImage(oldImageUrl);
                }

                showToast('Menu item updated successfully!', 'success');
            } else {
                const { error } = await supabase.from('menu_items').insert([itemData]);
                if (error) throw error;
                showToast('Menu item created successfully!', 'success');
            }

            await fetchItems();
            closeModal();
        } catch (error) {
            console.error('Error saving menu item:', error);
            showToast('Failed to save menu item', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (item: MenuItem) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Menu Item',
            message: 'Are you sure you want to delete this menu item?',
            onConfirm: () => performDelete(item),
        });
    };

    const performDelete = async (item: MenuItem) => {
        setConfirmModal({ ...confirmModal, isOpen: false });
        try {
            const { error } = await supabase.from('menu_items').delete().eq('id', item.id);
            if (error) throw error;
            if (item.image) await deleteImage(item.image);
            showToast('Menu item deleted successfully!', 'success');
            await fetchItems();
        } catch (error) {
            console.error('Error deleting menu item:', error);
            showToast('Failed to delete menu item', 'error');
        }
    };

    const toggleAvailable = async (item: MenuItem) => {
        try {
            const { error } = await supabase.from('menu_items').update({ is_available: !item.is_available }).eq('id', item.id);
            if (error) throw error;
            await fetchItems();
            showToast(`Item marked as ${!item.is_available ? 'available' : 'unavailable'}`, 'success');
        } catch (error) {
            console.error('Error toggling menu item:', error);
            showToast('Failed to update availability', 'error');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-rustic-blue" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-800">Menu</h1>
                    <p className="text-gray-500">Manage menu items</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-rustic-blue hover:bg-rustic-blue-dark text-white px-4 py-2 rounded-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Item
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search menu items..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none"
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as MenuCategory | 'all')}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue outline-none"
                >
                    <option value="all">All Categories</option>
                    {MENU_CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                </select>
            </div>

            {paginatedItems.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <Coffee className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                        {searchQuery || filterCategory !== 'all' ? 'No items found.' : 'No menu items yet.'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {paginatedItems.map((item) => (
                            <div key={item.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden ${!item.is_available ? 'opacity-60' : ''}`}>
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-32 object-cover" />
                                ) : (
                                    <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                                        <Coffee className="w-8 h-8 text-gray-300" />
                                    </div>
                                )}
                                <div className="p-4">
                                    <span className="text-xs px-2 py-1 bg-warm-cream text-warm-brown rounded-full capitalize">{item.category}</span>
                                    <h3 className="font-semibold text-gray-800 truncate mt-2">{item.name}</h3>
                                    <p className="text-sm text-gray-500 truncate">{item.description || 'No description'}</p>
                                    <p className="text-lg font-bold text-rust mt-2">₱{item.price.toFixed(2)}</p>
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                                        <button onClick={() => toggleAvailable(item)} className={`text-xs flex items-center gap-1 ${item.is_available ? 'text-green-600' : 'text-gray-400'}`}>
                                            {item.is_available ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                            {item.is_available ? 'Available' : 'Unavailable'}
                                        </button>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => openModal(item)} className="p-1.5 text-gray-500 hover:text-rustic-blue hover:bg-gray-100 rounded">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(item)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredItems.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                    />
                </>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-semibold text-gray-800">{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
                            <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                                            <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); }} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"><X className="w-4 h-4" /></button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer block">
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <span className="text-sm text-gray-500">Click to upload</span>
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                        </label>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none" placeholder="Item name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none resize-none" placeholder="Item description" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₱) *</label>
                                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required step="0.01" min="0" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none" placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value as MenuCategory)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none">
                                        {MENU_CATEGORIES.map(cat => (<option key={cat.value} value={cat.value}>{cat.label}</option>))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                                <select value={isAvailable ? 'available' : 'unavailable'} onChange={(e) => setIsAvailable(e.target.value === 'available')} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none">
                                    <option value="available">Available</option>
                                    <option value="unavailable">Unavailable</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">Cancel</button>
                                <button type="submit" disabled={isSaving} className="flex-1 px-4 py-2 bg-rustic-blue text-white rounded-lg hover:bg-rustic-blue-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                                    {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal isOpen={confirmModal.isOpen} title={confirmModal.title} message={confirmModal.message} confirmText={confirmModal.title.includes('Delete') ? 'Delete' : 'Update'} onConfirm={confirmModal.onConfirm} onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })} />
        </div>
    );
}
