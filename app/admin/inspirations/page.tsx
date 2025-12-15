'use client';

import { useEffect, useState } from 'react';
import { supabase, WeeklyInspiration, STORAGE_FOLDERS } from '@/lib/supabase';
import { uploadImage, deleteImage } from '@/lib/upload';
import { useToast } from '@/components/admin/Toast';
import ConfirmModal from '@/components/admin/ConfirmModal';
import {
    Pencil,
    Loader2,
    X,
    Upload,
    Sparkles,
    Share2,
    Facebook,
    Check,
    Copy
} from 'lucide-react';

const HASHTAGS = '#DeliverseWednesday #deliciosaph #FaithWednesday #MidweekDevotion #BibleVerseOfTheDay #VerseForToday';

export default function InspirationsPage() {
    const { showToast } = useToast();
    const [inspiration, setInspiration] = useState<WeeklyInspiration | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({ isOpen: false, title: '', message: '', onConfirm: () => { } });

    const [title, setTitle] = useState('Deli-verse Wednesday');
    const [quote, setQuote] = useState('');
    const [reference, setReference] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => {
        fetchInspiration();
    }, []);

    const fetchInspiration = async () => {
        try {
            // Get the first (and only) inspiration
            const { data, error } = await supabase
                .from('weekly_inspirations')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            setInspiration(data);
        } catch (error) {
            console.error('Error fetching inspiration:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setTitle('Deli-verse Wednesday');
        setQuote('');
        setReference('');
        setIsActive(true);
        setImageFile(null);
        setImagePreview('');
    };

    const openModal = () => {
        if (inspiration) {
            setTitle(inspiration.title || 'Deli-verse Wednesday');
            setQuote(inspiration.quote);
            setReference(inspiration.reference || '');
            setIsActive(inspiration.is_active);
            setImagePreview(inspiration.image || '');
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
        if (!quote.trim()) {
            showToast('Please enter a quote', 'error');
            return;
        }

        setConfirmModal({
            isOpen: true,
            title: inspiration ? 'Update Inspiration' : 'Create Inspiration',
            message: inspiration
                ? 'Are you sure you want to update this week\'s inspiration?'
                : 'Are you sure you want to create this inspiration?',
            onConfirm: () => performSave(),
        });
    };

    const performSave = async () => {
        setConfirmModal({ ...confirmModal, isOpen: false });
        setIsSaving(true);

        try {
            let imageUrl = inspiration?.image || null;
            const oldImageUrl = inspiration?.image;

            if (imageFile) {
                const uploadedUrl = await uploadImage(imageFile, STORAGE_FOLDERS.weeklyInspirations);
                if (uploadedUrl) imageUrl = uploadedUrl;
            }

            const itemData = { title, quote, reference, image: imageUrl, is_active: isActive };

            if (inspiration) {
                const { error } = await supabase.from('weekly_inspirations').update(itemData).eq('id', inspiration.id);
                if (error) throw error;
                if (imageFile && oldImageUrl && oldImageUrl !== imageUrl) await deleteImage(oldImageUrl);
                showToast('Inspiration updated successfully!', 'success');
            } else {
                const { error } = await supabase.from('weekly_inspirations').insert([itemData]);
                if (error) throw error;
                showToast('Inspiration created successfully!', 'success');
            }

            await fetchInspiration();
            closeModal();
        } catch (error) {
            console.error('Error saving inspiration:', error);
            showToast('Failed to save inspiration', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const generateShareText = () => {
        if (!inspiration) return '';
        const emoji = '🖤✨';
        return `Midweek reminder: ${inspiration.quote} ${emoji}\n\n— ${inspiration.reference || ''}\n\n${HASHTAGS}`;
    };

    const handleCopyShareText = async () => {
        try {
            await navigator.clipboard.writeText(generateShareText());
            showToast('Share text copied to clipboard!', 'success');
        } catch {
            showToast('Failed to copy text', 'error');
        }
    };

    const handleShareToFacebook = () => {
        // Get the website URL for sharing
        const websiteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://deliciosa-frontyard-coffee.vercel.app';
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(websiteUrl)}&quote=${encodeURIComponent(generateShareText())}`;

        // Open Facebook share dialog
        window.open(shareUrl, 'facebook-share', 'width=626,height=436');
        showToast('Opening Facebook share dialog...', 'success');
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
                    <h1 className="text-2xl font-serif font-bold text-gray-800">Weekly Inspiration</h1>
                    <p className="text-gray-500">Manage Deli-verse Wednesday content</p>
                </div>
            </div>

            {/* Main Content */}
            {inspiration ? (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden max-w-2xl">
                    {/* Preview Card */}
                    <div className="bg-gradient-to-br from-rustic-blue via-rustic-blue-dark to-rustic-blue p-8 text-white relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute top-4 right-4 w-20 h-20 border border-white/20 rounded-full"></div>
                        <div className="absolute bottom-4 left-4 w-12 h-12 border border-white/20 rounded-full"></div>

                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="w-5 h-5 text-warm-cream" />
                            <span className="text-warm-cream font-semibold text-sm tracking-wide">
                                {inspiration.title || 'Deli-verse Wednesday'}
                            </span>
                        </div>

                        <blockquote className="text-xl sm:text-2xl italic leading-relaxed mb-4">
                            "{inspiration.quote}"
                        </blockquote>

                        {inspiration.reference && (
                            <p className="text-warm-cream font-medium">— {inspiration.reference}</p>
                        )}

                        {/* Status Badge */}
                        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${inspiration.is_active ? 'bg-green-500' : 'bg-gray-500'
                            }`}>
                            {inspiration.is_active ? 'Active' : 'Hidden'}
                        </div>
                    </div>

                    {/* Image Preview */}
                    {inspiration.image && (
                        <div className="p-4 border-t bg-gray-50">
                            <p className="text-sm text-gray-500 mb-2">Background Image:</p>
                            <img src={inspiration.image} alt="Inspiration background" className="w-full h-32 object-cover rounded-lg" />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="p-4 border-t flex flex-wrap gap-3">
                        <button
                            onClick={openModal}
                            className="flex items-center gap-2 px-4 py-2 bg-rustic-blue text-white rounded-lg hover:bg-rustic-blue-dark transition-all"
                        >
                            <Pencil className="w-4 h-4" />
                            Edit Inspiration
                        </button>
                        <button
                            onClick={() => setShowShareModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-all"
                        >
                            <Facebook className="w-4 h-4" />
                            Share to Facebook
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center max-w-2xl">
                    <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-6">No weekly inspiration yet. Create your first one!</p>
                    <button
                        onClick={openModal}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-rustic-blue text-white rounded-lg hover:bg-rustic-blue-dark transition-all"
                    >
                        <Sparkles className="w-5 h-5" />
                        Create Inspiration
                    </button>
                </div>
            )}

            {/* Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {inspiration ? 'Edit Weekly Inspiration' : 'Create Weekly Inspiration'}
                            </h2>
                            <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none"
                                    placeholder="Deli-verse Wednesday"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quote *</label>
                                <textarea
                                    value={quote}
                                    onChange={(e) => setQuote(e.target.value)}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none resize-none"
                                    placeholder="Enter the inspirational quote..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Reference</label>
                                <input
                                    type="text"
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none"
                                    placeholder="Romans 8:28 ESV"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                                            <button
                                                type="button"
                                                onClick={() => { setImageFile(null); setImagePreview(''); }}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer block">
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <span className="text-sm text-gray-500">Click to upload image</span>
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                        </label>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={isActive ? 'active' : 'inactive'}
                                    onChange={(e) => setIsActive(e.target.value === 'active')}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none"
                                >
                                    <option value="active">Active (Visible on website)</option>
                                    <option value="inactive">Hidden</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 px-4 py-2 bg-rustic-blue text-white rounded-lg hover:bg-rustic-blue-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Share to Facebook Modal */}
            {showShareModal && inspiration && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                <Facebook className="w-6 h-6 text-[#1877F2]" />
                                Share to Facebook
                            </h2>
                            <button onClick={() => setShowShareModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Preview */}
                            {inspiration.image && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Image to Share:</p>
                                    <img src={inspiration.image} alt="Share preview" className="w-full h-48 object-cover rounded-lg" />
                                </div>
                            )}

                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">Caption:</p>
                                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                                    {generateShareText()}
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Tip:</strong> For best results, copy the caption below and post directly to your Facebook page with the image. This ensures the image appears correctly in the post.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleCopyShareText}
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all font-semibold"
                                >
                                    <Copy className="w-5 h-5" />
                                    Copy Caption
                                </button>
                                <button
                                    onClick={handleShareToFacebook}
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-all font-semibold"
                                >
                                    <Share2 className="w-5 h-5" />
                                    Open Facebook Share Dialog
                                </button>
                                <a
                                    href="https://www.facebook.com/Deliciosaphilippines"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                                >
                                    <Facebook className="w-5 h-5" />
                                    Go to Deliciosa Facebook Page
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText="Save"
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
            />
        </div>
    );
}
