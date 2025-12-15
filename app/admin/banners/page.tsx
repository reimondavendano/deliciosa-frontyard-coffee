'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase, Banner, STORAGE_FOLDERS } from '@/lib/supabase';
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
    GripVertical,
    Eye,
    EyeOff,
    Search,
    Check,
    Image as ImageIcon
} from 'lucide-react';

const ITEMS_PER_PAGE = 6;
const MAX_BANNERS = 5;

export default function BannersPage() {
    const { showToast } = useToast();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Upload state
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
        fetchBanners();
    }, []);

    const availableSlots = MAX_BANNERS - banners.length;

    const filteredBanners = useMemo(() => {
        if (!searchQuery.trim()) return banners;
        const query = searchQuery.toLowerCase();
        return banners.filter(banner =>
            (banner.title || '').toLowerCase().includes(query) ||
            (banner.description || '').toLowerCase().includes(query)
        );
    }, [banners, searchQuery]);

    const totalPages = Math.ceil(filteredBanners.length / ITEMS_PER_PAGE);
    const paginatedBanners = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredBanners.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredBanners, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const fetchBanners = async () => {
        try {
            const { data, error } = await supabase
                .from('banners')
                .select('*')
                .order('order', { ascending: true });

            if (error) throw error;
            setBanners(data || []);
        } catch (error) {
            console.error('Error fetching banners:', error);
            showToast('Failed to load banners', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = () => {
        if (availableSlots <= 0) {
            showToast('Maximum 5 banners allowed. Delete some to add more.', 'error');
            return;
        }
        setSelectedFiles([]);
        setFilePreviews([]);
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
        const maxAllowed = Math.min(availableSlots - selectedFiles.length, availableSlots);

        if (files.length > maxAllowed) {
            showToast(`You can only add ${maxAllowed} more banner${maxAllowed !== 1 ? 's' : ''}`, 'error');
            return;
        }

        const newFiles = [...selectedFiles, ...files].slice(0, availableSlots);
        setSelectedFiles(newFiles);

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

        if (banners.length + selectedFiles.length > MAX_BANNERS) {
            showToast(`Cannot exceed ${MAX_BANNERS} banners`, 'error');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            let successCount = 0;
            const startOrder = banners.length + 1;

            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];

                const imageUrl = await uploadImage(file, STORAGE_FOLDERS.banners);
                if (!imageUrl) {
                    showToast(`Failed to upload ${file.name}`, 'error');
                    continue;
                }

                const { error } = await supabase.from('banners').insert([{
                    image: imageUrl,
                    title: null,
                    description: null,
                    order: startOrder + i,
                    is_active: true,
                }]);

                if (error) {
                    console.error('Error inserting banner:', error);
                    await deleteImage(imageUrl);
                    continue;
                }

                successCount++;
                setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
            }

            showToast(`Successfully uploaded ${successCount} of ${selectedFiles.length} banner${selectedFiles.length !== 1 ? 's' : ''}!`, 'success');
            await fetchBanners();
            closeModal();
        } catch (error) {
            console.error('Error uploading banners:', error);
            showToast('Failed to upload banners', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = (banner: Banner) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Banner',
            message: 'Are you sure you want to delete this banner?',
            onConfirm: () => performDelete(banner),
        });
    };

    const performDelete = async (banner: Banner) => {
        setConfirmModal({ ...confirmModal, isOpen: false });

        try {
            const { error } = await supabase.from('banners').delete().eq('id', banner.id);
            if (error) throw error;
            if (banner.image) await deleteImage(banner.image);
            showToast('Banner deleted successfully!', 'success');
            await fetchBanners();
        } catch (error) {
            console.error('Error deleting banner:', error);
            showToast('Failed to delete banner', 'error');
        }
    };

    const toggleActive = async (banner: Banner) => {
        try {
            const { error } = await supabase
                .from('banners')
                .update({ is_active: !banner.is_active })
                .eq('id', banner.id);

            if (error) throw error;
            await fetchBanners();
            showToast(`Banner ${!banner.is_active ? 'activated' : 'hidden'}`, 'success');
        } catch (error) {
            console.error('Error toggling banner:', error);
            showToast('Failed to update banner status', 'error');
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
                    <h1 className="text-2xl font-serif font-bold text-gray-800">Banners</h1>
                    <p className="text-gray-500">
                        Hero carousel banners • {banners.length}/{MAX_BANNERS}
                    </p>
                </div>
                <button
                    onClick={openModal}
                    disabled={availableSlots <= 0}
                    className="flex items-center gap-2 bg-rustic-blue hover:bg-rustic-blue-dark text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="w-5 h-5" />
                    Add Banners
                </button>
            </div>

            {banners.length > 0 && (
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search banners..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none"
                        />
                    </div>
                </div>
            )}

            {paginatedBanners.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                        {searchQuery ? 'No banners found matching your search.' : 'No banners yet. Add your first banner!'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedBanners.map((banner) => (
                            <div
                                key={banner.id}
                                className={`bg-white rounded-xl shadow-sm border overflow-hidden ${!banner.is_active ? 'opacity-60' : ''
                                    }`}
                            >
                                <div className="aspect-video relative">
                                    <img
                                        src={banner.image}
                                        alt={banner.title || 'Banner'}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                        <GripVertical className="w-3 h-3" />
                                        Order: {banner.order}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={() => toggleActive(banner)}
                                            className={`flex items-center gap-1 text-sm ${banner.is_active ? 'text-green-600' : 'text-gray-400'
                                                }`}
                                        >
                                            {banner.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            {banner.is_active ? 'Active' : 'Hidden'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(banner)}
                                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredBanners.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                    />
                </>
            )}

            {/* Upload Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
                        <div className="flex items-center justify-between p-6 border-b">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Upload Banners</h2>
                                <p className="text-sm text-gray-500">Add up to {availableSlots} more banner{availableSlots !== 1 ? 's' : ''}</p>
                            </div>
                            <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* File Upload Area */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Banner Images ({selectedFiles.length}/{availableSlots} selected)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    {filePreviews.length === 0 ? (
                                        <label className="cursor-pointer block">
                                            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-600 font-medium">Click to select banner images</p>
                                            <p className="text-sm text-gray-400 mt-1">Recommended: 1920x600 or similar aspect ratio</p>
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
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {filePreviews.map((preview, idx) => (
                                                    <div key={idx} className="relative aspect-video">
                                                        <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(idx)}
                                                            className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                        <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                                                            #{idx + 1}
                                                        </div>
                                                    </div>
                                                ))}
                                                {selectedFiles.length < availableSlots && (
                                                    <label className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-rustic-blue transition-all">
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
                                            Upload {selectedFiles.length} Banner{selectedFiles.length !== 1 ? 's' : ''}
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
