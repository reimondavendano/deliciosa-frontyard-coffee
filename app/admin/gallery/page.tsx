'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase, GalleryItem, GalleryCategory, STORAGE_FOLDERS } from '@/lib/supabase';
import { uploadImage, deleteImage } from '@/lib/upload';
import { useToast } from '@/components/admin/Toast';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Pagination from '@/components/admin/Pagination';
import {
    Plus,
    Trash2,
    Loader2,
    X,
    Upload,
    Images,
    Search,
    Check
} from 'lucide-react';

const GALLERY_CATEGORIES: { value: GalleryCategory; label: string }[] = [
    { value: 'events', label: 'Events' },
    { value: 'operations', label: 'Operations' },
];

const ITEMS_PER_PAGE = 12;
const MAX_UPLOAD_PER_BATCH = 10;

export default function GalleryPage() {
    const { showToast } = useToast();
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [filterCategory, setFilterCategory] = useState<GalleryCategory | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Upload state
    const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('events');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [filePreviews, setFilePreviews] = useState<string[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({ isOpen: false, title: '', message: '', onConfirm: () => { } });

    useEffect(() => {
        fetchItems();
    }, []);

    // Count images per category
    const eventCount = items.filter(i => i.category === 'events').length;
    const operationsCount = items.filter(i => i.category === 'operations').length;

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
            const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase());
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
            const { data, error } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setItems(data || []);
        } catch (error) {
            console.error('Error fetching gallery items:', error);
            showToast('Failed to load gallery', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = () => {
        setSelectedFiles([]);
        setFilePreviews([]);
        setSelectedCategory('events');
        setUploadProgress(0);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFiles([]);
        setFilePreviews([]);
        setUploadProgress(0);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        // Check limit based on category
        const currentCount = selectedCategory === 'events' ? eventCount : operationsCount;
        const availableSlots = MAX_UPLOAD_PER_BATCH - (selectedFiles.length);
        const categoryLimit = 10 - currentCount;
        const maxAllowed = Math.min(availableSlots, categoryLimit);

        if (files.length > maxAllowed) {
            showToast(`You can only add ${maxAllowed} more images to ${selectedCategory}`, 'error');
            return;
        }

        // Add to existing selection
        const newFiles = [...selectedFiles, ...files].slice(0, MAX_UPLOAD_PER_BATCH);
        setSelectedFiles(newFiles);

        // Create previews
        const previews = newFiles.map(file => URL.createObjectURL(file));
        setFilePreviews(previews);
    };

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        const newPreviews = filePreviews.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        setFilePreviews(newPreviews);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            showToast('Please select at least one image', 'error');
            return;
        }

        // Check category limit
        const currentCount = selectedCategory === 'events' ? eventCount : operationsCount;
        if (currentCount + selectedFiles.length > 10) {
            showToast(`Cannot exceed 10 images for ${selectedCategory}. Currently have ${currentCount}.`, 'error');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            let successCount = 0;

            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];

                // Upload image
                const imageUrl = await uploadImage(file, STORAGE_FOLDERS.gallery);
                if (!imageUrl) {
                    showToast(`Failed to upload ${file.name}`, 'error');
                    continue;
                }

                // Insert into database
                const { error } = await supabase.from('gallery_items').insert([{
                    image: imageUrl,
                    category: selectedCategory,
                    title: null,
                    description: null,
                }]);

                if (error) {
                    console.error('Error inserting gallery item:', error);
                    await deleteImage(imageUrl);
                    continue;
                }

                successCount++;
                setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
            }

            showToast(`Successfully uploaded ${successCount} of ${selectedFiles.length} images!`, 'success');
            await fetchItems();
            closeModal();
        } catch (error) {
            console.error('Error uploading images:', error);
            showToast('Failed to upload images', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = (item: GalleryItem) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Image',
            message: 'Are you sure you want to delete this image?',
            onConfirm: () => performDelete(item),
        });
    };

    const performDelete = async (item: GalleryItem) => {
        setConfirmModal({ ...confirmModal, isOpen: false });
        try {
            const { error } = await supabase.from('gallery_items').delete().eq('id', item.id);
            if (error) throw error;
            if (item.image) await deleteImage(item.image);
            showToast('Image deleted successfully!', 'success');
            await fetchItems();
        } catch (error) {
            console.error('Error deleting gallery item:', error);
            showToast('Failed to delete image', 'error');
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
                    <h1 className="text-2xl font-serif font-bold text-gray-800">Gallery</h1>
                    <p className="text-gray-500">
                        Events: {eventCount}/10 • Operations: {operationsCount}/10
                    </p>
                </div>
                <button onClick={openModal} className="flex items-center gap-2 bg-rustic-blue hover:bg-rustic-blue-dark text-white px-4 py-2 rounded-lg transition-all">
                    <Plus className="w-5 h-5" />
                    Add Images
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search gallery..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none"
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as GalleryCategory | 'all')}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue outline-none"
                >
                    <option value="all">All ({items.length})</option>
                    <option value="events">Events ({eventCount})</option>
                    <option value="operations">Operations ({operationsCount})</option>
                </select>
            </div>

            {paginatedItems.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <Images className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">{searchQuery || filterCategory !== 'all' ? 'No images found.' : 'No gallery images yet.'}</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                        {paginatedItems.map((item) => (
                            <div key={item.id} className="group relative rounded-lg overflow-hidden shadow-sm border aspect-square">
                                <img src={item.image} alt="Gallery" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <button
                                        onClick={() => handleDelete(item)}
                                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                    <span className="text-xs px-2 py-0.5 bg-white/20 text-white rounded capitalize">
                                        {item.category}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredItems.length} itemsPerPage={ITEMS_PER_PAGE} />
                </>
            )}

            {/* Upload Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
                        <div className="flex items-center justify-between p-6 border-b">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Upload Gallery Images</h2>
                                <p className="text-sm text-gray-500">Select up to {MAX_UPLOAD_PER_BATCH} images at a time</p>
                            </div>
                            <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Category Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                <div className="flex gap-3">
                                    {GALLERY_CATEGORIES.map(cat => {
                                        const count = cat.value === 'events' ? eventCount : operationsCount;
                                        const isFull = count >= 10;
                                        return (
                                            <button
                                                key={cat.value}
                                                type="button"
                                                disabled={isFull}
                                                onClick={() => {
                                                    setSelectedCategory(cat.value);
                                                    setSelectedFiles([]);
                                                    setFilePreviews([]);
                                                }}
                                                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${selectedCategory === cat.value
                                                        ? 'border-rustic-blue bg-rustic-blue/5 text-rustic-blue'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    } ${isFull ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <p className="font-medium">{cat.label}</p>
                                                <p className="text-xs text-gray-500">{count}/10 images</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* File Upload Area */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Images * ({selectedFiles.length}/{MAX_UPLOAD_PER_BATCH} selected)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    {filePreviews.length === 0 ? (
                                        <label className="cursor-pointer block">
                                            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-600 font-medium">Click to select images</p>
                                            <p className="text-sm text-gray-400 mt-1">or drag and drop</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleFileSelect}
                                                className="hidden"
                                            />
                                        </label>
                                    ) : (
                                        <div className="space-y-4">
                                            {/* Preview Grid */}
                                            <div className="grid grid-cols-5 gap-2">
                                                {filePreviews.map((preview, idx) => (
                                                    <div key={idx} className="relative aspect-square">
                                                        <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(idx)}
                                                            className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {selectedFiles.length < MAX_UPLOAD_PER_BATCH && (
                                                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-rustic-blue transition-all">
                                                        <Plus className="w-6 h-6 text-gray-400" />
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={handleFileSelect}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Upload Progress */}
                            {isUploading && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Uploading...</span>
                                        <span className="font-medium text-rustic-blue">{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-rustic-blue h-2 rounded-full transition-all"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={isUploading}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={isUploading || selectedFiles.length === 0}
                                    className="flex-1 px-4 py-2 bg-rustic-blue text-white rounded-lg hover:bg-rustic-blue-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Upload {selectedFiles.length} Image{selectedFiles.length !== 1 ? 's' : ''}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText="Delete"
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
            />
        </div>
    );
}
