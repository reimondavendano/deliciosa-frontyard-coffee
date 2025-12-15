'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase, WeeklyInspiration, STORAGE_FOLDERS } from '@/lib/supabase';
import { uploadImage, deleteImage } from '@/lib/upload';
import { useToast } from '@/components/admin/Toast';
import ConfirmModal from '@/components/admin/ConfirmModal';
import html2canvas from 'html2canvas';
import {
    Pencil,
    Loader2,
    X,
    Upload,
    Sparkles,
    Share2,
    Facebook,
    Check,
    Copy,
    Download,
    ImageIcon
} from 'lucide-react';

const HASHTAGS = '#DeliverseWednesday #deliciosaph #FaithWednesday #MidweekDevotion #BibleVerseOfTheDay #VerseForToday';

export default function InspirationsPage() {
    const { showToast } = useToast();
    const [inspiration, setInspiration] = useState<WeeklyInspiration | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Hidden ref for generating the image
    const socialCardRef = useRef<HTMLDivElement>(null);

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

    const handleShareToFacebook = () => {
        // Get the dynamic inspiration URL so Facebook scrapes the correct image
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://deliciosa-frontyard-coffee.vercel.app';
        const shareUrl = inspiration
            ? `${baseUrl}/inspiration/${inspiration.id}`
            : baseUrl;

        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(generateShareText())}`;

        // Open Facebook share dialog
        window.open(facebookShareUrl, 'facebook-share', 'width=626,height=436');
        showToast('Opening Facebook share prompt...', 'success');
    };
    const generateShareText = () => {
        if (!inspiration) return '';
        const emoji = '🖤✨';
        return `Midweek reminder: ${inspiration.quote} ${emoji}\n\n— ${inspiration.reference || ''}\n\n${HASHTAGS}`;
    };

    const handleCopyShareText = async () => {
        try {
            await navigator.clipboard.writeText(generateShareText());
            showToast('Caption copied to clipboard!', 'success');
        } catch {
            showToast('Failed to copy text', 'error');
        }
    };

    const handleDownloadImage = async () => {
        if (!socialCardRef.current) return;
        setIsGenerating(true);

        try {
            // Small delay to ensure styles are applied
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(socialCardRef.current, {
                useCORS: true, // Important for external images
                scale: 2, // Higher resolution
                backgroundColor: '#1E3A8A', // fallback color
            });

            const link = document.createElement('a');
            link.download = `deliverse-wednesday-${new Date().toISOString().split('T')[0]}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            showToast('Image downloaded successfully!', 'success');
        } catch (error) {
            console.error('Error generating image:', error);
            showToast('Failed to generate image. Try again.', 'error');
        } finally {
            setIsGenerating(false);
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
                    <h1 className="text-2xl font-serif font-bold text-gray-800">Weekly Inspiration</h1>
                    <p className="text-gray-500">Manage Deli-verse Wednesday content</p>
                </div>
            </div>

            {/* Main Content */}
            {inspiration ? (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden max-w-2xl">
                    {/* Preview Card */}
                    <div className="bg-gradient-to-br from-rustic-blue via-rustic-blue-dark to-rustic-blue p-8 text-white relative overflow-hidden min-h-[300px] flex flex-col justify-center text-center">
                        {/* Background Image Overlay */}
                        {inspiration.image && (
                            <div
                                className="absolute inset-0 z-0 opacity-30"
                                style={{
                                    backgroundImage: `url(${inspiration.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            />
                        )}

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 mb-6 bg-white/10 px-4 py-1 rounded-full backdrop-blur-sm mx-auto">
                                <Sparkles className="w-4 h-4 text-warm-cream" />
                                <span className="text-warm-cream font-semibold text-sm tracking-wide">
                                    {inspiration.title || 'Deli-verse Wednesday'}
                                </span>
                            </div>

                            <blockquote className="text-xl sm:text-3xl italic leading-relaxed mb-6 font-serif px-8">
                                "{inspiration.quote}"
                            </blockquote>

                            {inspiration.reference && (
                                <p className="text-warm-cream font-medium text-lg">— {inspiration.reference}</p>
                            )}
                        </div>

                        {/* Status Badge */}
                        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold z-20 ${inspiration.is_active ? 'bg-green-500' : 'bg-gray-500'
                            }`}>
                            {inspiration.is_active ? 'Active' : 'Hidden'}
                        </div>
                    </div>

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
                            <Share2 className="w-4 h-4" />
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

            {/* Share to Facebook Modal */}
            {showShareModal && inspiration && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-scale-in">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                <Facebook className="w-6 h-6 text-[#1877F2]" />
                                Share to Facebook
                            </h2>
                            <button onClick={() => setShowShareModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Steps Guide */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-semibold text-blue-900 mb-2">How to share perfectly:</h3>
                                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                                    <li>Generate and download the image below.</li>
                                    <li>Copy the prepared caption.</li>
                                    <li>Click "Go to Facebook Page" and create a post.</li>
                                    <li>Upload the image and paste the caption!</li>
                                </ol>
                            </div>

                            {/* Image Generation Section */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-700">1. Social Image</p>
                                    <button
                                        onClick={handleDownloadImage}
                                        disabled={isGenerating}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-rustic-blue text-white text-xs font-semibold rounded hover:bg-rustic-blue-dark transition-all disabled:opacity-50"
                                    >
                                        {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                                        Download Image
                                    </button>
                                </div>

                                {/* The element to be captured (Hidden off-screen but rendered) */}
                                <div className="overflow-hidden bg-gray-100 rounded-lg border flex justify-center">
                                    {/* We scale this down for preview, but capture full size */}
                                    <div className="transform scale-50 origin-top h-[300px]">
                                        {/* THIS IS THE ACTUAL CARD TEMPLATE FOR FACEBOOK */}
                                        <div
                                            ref={socialCardRef}
                                            className="w-[600px] h-[600px] bg-gradient-to-br from-rustic-blue via-rustic-blue-dark to-rustic-blue relative flex flex-col items-center justify-center text-center p-12 text-white"
                                        >
                                            {/* Background Image */}
                                            {inspiration.image && (
                                                <div
                                                    className="absolute inset-0 z-0 opacity-40"
                                                    style={{
                                                        backgroundImage: `url(${inspiration.image})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }}
                                                />
                                            )}

                                            {/* Overlay Gradient */}
                                            <div className="absolute inset-0 bg-black/20 z-0"></div>

                                            {/* Content */}
                                            <div className="relative z-10 space-y-8">
                                                <div className="inline-flex items-center gap-2 bg-white/10 px-6 py-2 rounded-full backdrop-blur-md border border-white/20">
                                                    <Sparkles className="w-6 h-6 text-warm-cream" />
                                                    <span className="text-warm-cream font-bold tracking-widest uppercase">
                                                        {inspiration.title || 'Deli-verse Wednesday'}
                                                    </span>
                                                </div>

                                                <blockquote className="font-serif text-5xl font-medium leading-tight italic drop-shadow-lg">
                                                    "{inspiration.quote}"
                                                </blockquote>

                                                {inspiration.reference && (
                                                    <div className="mt-8 relative">
                                                        <div className="w-16 h-1 bg-warm-cream mx-auto mb-4 rounded-full"></div>
                                                        <p className="text-2xl font-semibold tracking-wide text-warm-cream">
                                                            {inspiration.reference}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Footer Branding */}
                                            <div className="absolute bottom-8 text-white/50 text-sm font-light tracking-widest uppercase">
                                                Deliciosa Frontyard Café
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Space holder for the scaled container height */}
                                <div className="h-[-250px]"></div>
                            </div>

                            {/* Caption Section */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-700">2. Caption</p>
                                    <button
                                        onClick={handleCopyShareText}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded hover:bg-gray-200 transition-all"
                                    >
                                        <Copy className="w-3 h-3" />
                                        Copy
                                    </button>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 whitespace-pre-wrap font-mono border">
                                    {generateShareText()}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2">
                                <a
                                    href="https://www.facebook.com/Deliciosaphilippines"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-all font-semibold shadow-md hover:shadow-lg"
                                >
                                    <Facebook className="w-5 h-5" />
                                    Go to Facebook Page (Manual Post)
                                </a>

                                <div className="relative flex py-2 items-center">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <span className="flex-shrink-0 mx-4 text-gray-400 text-xs text-center">OR SHARE LINK</span>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>

                                <button
                                    onClick={handleShareToFacebook}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-[#1877F2] text-[#1877F2] rounded-lg hover:bg-blue-50 transition-all font-semibold"
                                >
                                    <Share2 className="w-5 h-5" />
                                    Share Link (Auto-Image Prompt)
                                </button>
                                <p className="text-xs text-gray-500 text-center px-4">
                                    *This shares a clickable link that automatically shows the image in the prompt!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal - Re-using your existing one */}
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
