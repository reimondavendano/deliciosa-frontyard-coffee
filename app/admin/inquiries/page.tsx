'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase, Inquiry, InquiryStatus } from '@/lib/supabase';
import { useToast } from '@/components/admin/Toast';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Pagination from '@/components/admin/Pagination';
import {
    Loader2,
    X,
    MessageSquare,
    Mail,
    Phone,
    Calendar,
    Eye,
    Archive,
    Trash2,
    Search
} from 'lucide-react';

const STATUS_COLORS = {
    new: 'bg-green-100 text-green-700',
    read: 'bg-blue-100 text-blue-700',
    archived: 'bg-gray-100 text-gray-500',
};

const ITEMS_PER_PAGE = 10;

export default function InquiriesPage() {
    const { showToast } = useToast();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [filterStatus, setFilterStatus] = useState<InquiryStatus | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({ isOpen: false, title: '', message: '', onConfirm: () => { } });

    useEffect(() => {
        fetchInquiries();
    }, []);

    const filteredInquiries = useMemo(() => {
        return inquiries.filter(inquiry => {
            const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus;
            const matchesSearch = inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                inquiry.message?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [inquiries, filterStatus, searchQuery]);

    const totalPages = Math.ceil(filteredInquiries.length / ITEMS_PER_PAGE);
    const paginatedInquiries = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredInquiries.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredInquiries, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterStatus]);

    const newCount = inquiries.filter(i => i.status === 'new').length;

    const fetchInquiries = async () => {
        try {
            const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setInquiries(data || []);
        } catch (error) {
            console.error('Error fetching inquiries:', error);
            showToast('Failed to load inquiries', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id: string, status: InquiryStatus) => {
        try {
            const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
            if (error) throw error;
            await fetchInquiries();
            if (selectedInquiry?.id === id) {
                setSelectedInquiry(prev => prev ? { ...prev, status } : null);
            }
            showToast(`Inquiry marked as ${status}`, 'success');
        } catch (error) {
            console.error('Error updating inquiry:', error);
            showToast('Failed to update inquiry', 'error');
        }
    };

    const handleDelete = (inquiry: Inquiry) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Inquiry',
            message: 'Are you sure you want to delete this inquiry?',
            onConfirm: () => performDelete(inquiry.id),
        });
    };

    const performDelete = async (id: string) => {
        setConfirmModal({ ...confirmModal, isOpen: false });
        try {
            const { error } = await supabase.from('inquiries').delete().eq('id', id);
            if (error) throw error;
            showToast('Inquiry deleted successfully!', 'success');
            await fetchInquiries();
            if (selectedInquiry?.id === id) setSelectedInquiry(null);
        } catch (error) {
            console.error('Error deleting inquiry:', error);
            showToast('Failed to delete inquiry', 'error');
        }
    };

    const openInquiry = async (inquiry: Inquiry) => {
        setSelectedInquiry(inquiry);
        if (inquiry.status === 'new') await updateStatus(inquiry.id, 'read');
    };

    const handleArchive = (inquiry: Inquiry) => {
        setConfirmModal({
            isOpen: true,
            title: 'Archive Inquiry',
            message: 'Are you sure you want to archive this inquiry?',
            onConfirm: () => {
                setConfirmModal({ ...confirmModal, isOpen: false });
                updateStatus(inquiry.id, 'archived');
            },
        });
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
                    <h1 className="text-2xl font-serif font-bold text-gray-800 flex items-center gap-2">
                        Inquiries
                        {newCount > 0 && <span className="text-sm bg-red-500 text-white px-2 py-0.5 rounded-full">{newCount} new</span>}
                    </h1>
                    <p className="text-gray-500">Manage customer inquiries</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, email, or message..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue focus:ring-2 focus:ring-rustic-blue/20 outline-none"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as InquiryStatus | 'all')}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:border-rustic-blue outline-none"
                >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="archived">Archived</option>
                </select>
            </div>

            {paginatedInquiries.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">{searchQuery || filterStatus !== 'all' ? 'No inquiries found.' : 'No inquiries yet.'}</p>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedInquiries.map((inquiry) => (
                                        <tr key={inquiry.id} className={`hover:bg-gray-50 cursor-pointer ${inquiry.status === 'new' ? 'bg-green-50/50' : ''}`} onClick={() => openInquiry(inquiry)}>
                                            <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_COLORS[inquiry.status]}`}>{inquiry.status}</span></td>
                                            <td className="px-6 py-4"><p className="font-medium text-gray-800">{inquiry.name}</p></td>
                                            <td className="px-6 py-4"><p className="text-gray-600 text-sm">{inquiry.email}</p></td>
                                            <td className="px-6 py-4"><p className="text-gray-500 text-sm">{new Date(inquiry.created_at).toLocaleDateString()}</p></td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                                    <button onClick={() => openInquiry(inquiry)} className="p-1.5 text-gray-500 hover:text-rustic-blue hover:bg-gray-100 rounded" title="View"><Eye className="w-4 h-4" /></button>
                                                    <button onClick={() => handleArchive(inquiry)} className="p-1.5 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded" title="Archive"><Archive className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDelete(inquiry)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredInquiries.length} itemsPerPage={ITEMS_PER_PAGE} />
                </>
            )}

            {selectedInquiry && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
                        <div className="flex items-center justify-between p-6 border-b">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Inquiry Details</h2>
                                <span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_COLORS[selectedInquiry.status]}`}>{selectedInquiry.status}</span>
                            </div>
                            <button onClick={() => setSelectedInquiry(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-rustic-blue/10 rounded-full flex items-center justify-center">
                                    <span className="text-rustic-blue font-bold text-lg">{selectedInquiry.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{selectedInquiry.name}</p>
                                    <p className="text-sm text-gray-500">{new Date(selectedInquiry.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <a href={`mailto:${selectedInquiry.email}`} className="text-rustic-blue hover:underline">{selectedInquiry.email}</a>
                                </div>
                                {selectedInquiry.phone && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <a href={`tel:${selectedInquiry.phone}`} className="text-gray-700">{selectedInquiry.phone}</a>
                                    </div>
                                )}
                                {selectedInquiry.event_date && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-700">{new Date(selectedInquiry.event_date).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                            {selectedInquiry.message && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Message:</p>
                                    <p className="text-gray-600 whitespace-pre-wrap">{selectedInquiry.message}</p>
                                </div>
                            )}
                            <div className="flex gap-2 pt-4 border-t">
                                {selectedInquiry.status !== 'archived' && (
                                    <button onClick={() => handleArchive(selectedInquiry)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                                        <Archive className="w-4 h-4" />Archive
                                    </button>
                                )}
                                <button onClick={() => handleDelete(selectedInquiry)} className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                                    <Trash2 className="w-4 h-4" />Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal isOpen={confirmModal.isOpen} title={confirmModal.title} message={confirmModal.message} confirmText={confirmModal.title.includes('Delete') ? 'Delete' : 'Confirm'} onConfirm={confirmModal.onConfirm} onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })} />
        </div>
    );
}
