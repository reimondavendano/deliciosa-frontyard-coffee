'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase, Package, PackageCategory, STORAGE_FOLDERS } from '@/lib/supabase';
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
    Package as PackageIcon,
    Search
} from 'lucide-react';

const PACKAGE_CATEGORIES: { value: PackageCategory; label: string }[] = [
    { value: 'coffee cart', label: 'Coffee Cart' },
    { value: 'pastry cart', label: 'Pastry Cart' },
    { value: 'combination', label: 'Combination' },
];

const ITEMS_PER_PAGE = 6;

export default function PackagesPage() {
    const { showToast } = useToast();
    const [items, setItems] = useState<Package[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Package | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [filterCategory, setFilterCategory] = useState<PackageCategory | 'all'>('all');
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
    const [category, setCategory] = useState<PackageCategory>('coffee cart');
    const [inclusions, setInclusions] = useState('');
    const [isActive, setIsActive] = useState(true);
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
            const { data, error } = await supabase.from('packages').select('*').order('category', { ascending: true }).order('name', { ascending: true });
            if (error) throw error;
            setItems(data || []);
        } catch (error) {
            console.error('Error fetching packages:', error);
            showToast('Failed to load packages', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setPrice('');
        setCategory('coffee cart');
        setInclusions('');
        setIsActive(true);
        setImageFile(null);
        setImagePreview('');
        setEditingItem(null);
    };

    const openModal = (item?: Package) => {
        if (item) {
            setEditingItem(item);
            setName(item.name);
            setDescription(item.description || '');
            setPrice(item.price?.toString() || '');
            setCategory(item.category);
            setInclusions(item.inclusions?.join('\n') || '');
            setIsActive(item.is_active);
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
        if (!name.trim()) {
            showToast('Please enter a package name', 'error');
            return;
        }

        if (editingItem) {
            setConfirmModal({
                isOpen: true,
                title: 'Update Package',
                message: 'Are you sure you want to update this package?',
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
                const uploadedUrl = await uploadImage(imageFile, STORAGE_FOLDERS.packages);
                if (uploadedUrl) imageUrl = uploadedUrl;
            }

            const inclusionsList = inclusions.split('\n').map(s => s.trim()).filter(s => s.length > 0);

            const itemData = {
                name,
                description,
                price: price ? parseFloat(price) : null,
                category,
                image: imageUrl,
                inclusions: inclusionsList.length > 0 ? inclusionsList : null,
                is_active: isActive,
            };

            if (editingItem) {
                const { error } = await supabase.from('packages').update(itemData).eq('id', editingItem.id);
                if (error) throw error;
                if (imageFile && oldImageUrl && oldImageUrl !== imageUrl) await deleteImage(oldImageUrl);
                showToast('Package updated successfully!', 'success');
            } else {
                const { error } = await supabase.from('packages').insert([itemData]);
                if (error) throw error;
                showToast('Package created successfully!', 'success');
            }

            await fetchItems();
            closeModal();
        } catch (error) {
            console.error('Error saving package:', error);
            showToast('Failed to save package', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (item: Package) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Package',
            message: 'Are you sure you want to delete this package?',
            onConfirm: () => performDelete(item),
        });
    };

    const performDelete = async (item: Package) => {
        setConfirmModal({ ...confirmModal, isOpen: false });
        try {
            const { error } = await supabase.from('packages').delete().eq('id', item.id);
            if (error) throw error;
            if (item.image) await deleteImage(item.image);
            showToast('Package deleted successfully!', 'success');
            await fetchItems();
        } catch (error) {
            console.error('Error deleting package:', error);
            showToast('Failed to delete package', 'error');
        }
    };

    const toggleActive = async (item: Package) => {
        try {
            const { error } = await supabase.from('packages').update({ is_active: !item.is_active }).eq('id', item.id);
            if (error) throw error;
            await fetchItems();
            showToast(`Package ${!item.is_active ? 'activated' : 'hidden'}`, 'success');
        } catch (error) {
            console.error('Error toggling package:', error);
            showToast('Failed to update status', 'error');
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
                    <h1 className="text-2xl font-serif font-bold text-gray-800">Packages</h1>
                    <p className="text-gray-500">Manage service packages</p>
                </div>
                <button onClick={() => openModal()} className="flex items-center gap-2 bg-rustic-blue hover:bg-rustic-blue-dark text-white px-4 py-2 rounded-lg transition-all">
                    <Plus className="w-5 h-5" />
                    Add Package
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search packages..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none"
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as PackageCategory | 'all')}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue outline-none"
                >
                    <option value="all">All Categories</option>
                    {PACKAGE_CATEGORIES.map(cat => (<option key={cat.value} value={cat.value}>{cat.label}</option>))}
                </select>
            </div>

            {paginatedItems.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <PackageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">{searchQuery || filterCategory !== 'all' ? 'No packages found.' : 'No packages yet.'}</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedItems.map((item) => (
                            <div key={item.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden ${!item.is_active ? 'opacity-60' : ''}`}>
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
                                ) : (
                                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                                        <PackageIcon className="w-12 h-12 text-gray-300" />
                                    </div>
                                )}
                                <div className="p-5">
                                    <span className="text-xs px-2 py-1 bg-warm-cream text-warm-brown rounded-full capitalize">{item.category}</span>
                                    <h3 className="font-semibold text-lg text-gray-800 mt-3">{item.name}</h3>
                                    {item.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>}
                                    {item.price && <p className="text-xl font-bold text-rust mt-3">₱{item.price.toFixed(2)}</p>}
                                    {item.inclusions && item.inclusions.length > 0 && (
                                        <ul className="mt-3 text-sm text-gray-600 space-y-1">
                                            {item.inclusions.slice(0, 3).map((inc, idx) => (
                                                <li key={idx} className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-rust rounded-full"></span>
                                                    {inc}
                                                </li>
                                            ))}
                                            {item.inclusions.length > 3 && <li className="text-gray-400">+{item.inclusions.length - 3} more...</li>}
                                        </ul>
                                    )}
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                        <button onClick={() => toggleActive(item)} className={`text-sm flex items-center gap-1 ${item.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                                            {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            {item.is_active ? 'Active' : 'Hidden'}
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => openModal(item)} className="p-2 text-gray-500 hover:text-rustic-blue hover:bg-gray-100 rounded-lg"><Pencil className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(item)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredItems.length} itemsPerPage={ITEMS_PER_PAGE} />
                </>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-semibold text-gray-800">{editingItem ? 'Edit Package' : 'Add Package'}</h2>
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
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none" placeholder="Package name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none resize-none" placeholder="Package description" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₱)</label>
                                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} step="0.01" min="0" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none" placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value as PackageCategory)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none">
                                        {PACKAGE_CATEGORIES.map(cat => (<option key={cat.value} value={cat.value}>{cat.label}</option>))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Inclusions (one per line)</label>
                                <textarea value={inclusions} onChange={(e) => setInclusions(e.target.value)} rows={4} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none resize-none" placeholder="Coffee machine&#10;Barista service&#10;100 cups" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select value={isActive ? 'active' : 'inactive'} onChange={(e) => setIsActive(e.target.value === 'active')} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none">
                                    <option value="active">Active</option>
                                    <option value="inactive">Hidden</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">Cancel</button>
                                <button type="submit" disabled={isSaving} className="flex-1 px-4 py-2 bg-rustic-blue text-white rounded-lg hover:bg-rustic-blue-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                                    {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Package'}
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
