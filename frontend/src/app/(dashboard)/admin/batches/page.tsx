'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Calendar, Users, Tag, CheckCircle, Clock, XCircle, Loader2, Edit2, X } from "lucide-react";
import api from '@/lib/api';
import { toast } from 'sonner';

interface Batch {
    id: number;
    name: string;
    description: string;
    price: string;
    start_date: string;
    end_date: string | null;
    status: 'upcoming' | 'running' | 'completed';
    is_active: boolean;
    created_at: string;
    image?: string | null;
}

interface BatchForm {
    name: string;
    description: string;
    price: string;
    start_date: string;
    end_date: string;
    status: 'upcoming' | 'running' | 'completed';
    is_active: boolean;
}

const STATUS_CONFIG = {
    upcoming: { label: 'Upcoming', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: Clock },
    running: { label: 'Running', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle },
    completed: { label: 'Completed', color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', icon: XCircle },
};

const emptyForm: BatchForm = {
    name: '',
    description: '',
    price: '',
    start_date: '',
    end_date: '',
    status: 'upcoming',
    is_active: true,
};

export default function AdminBatchesPage() {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<BatchForm>(emptyForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            const res = await api.get('/batches/batches/');
            const data = res.data.results || res.data;
            setBatches(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Failed to load batches');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.price || !formData.start_date) {
            toast.error('Name, price and start date are required');
            return;
        }
        setSaving(true);
        try {
            const dataToSend = new FormData();
            dataToSend.append('name', formData.name);
            dataToSend.append('description', formData.description);
            dataToSend.append('price', formData.price);
            dataToSend.append('start_date', formData.start_date);
            dataToSend.append('end_date', formData.end_date || '');
            dataToSend.append('status', formData.status);
            dataToSend.append('is_active', String(formData.is_active));
            if (imageFile) {
                dataToSend.append('image', imageFile);
            }

            let res: any;
            if (editingId) {
                res = await api.put(`/batches/batches/${editingId}/`, dataToSend);
                setBatches(prev => prev.map(b => b.id === editingId ? res.data : b));
                toast.success('Batch updated!');
            } else {
                res = await api.post('/batches/batches/', dataToSend);
                setBatches(prev => [res.data, ...prev]);
                toast.success('Batch created!');
            }
            setShowForm(false);
            setEditingId(null);
            setFormData(emptyForm);
            setImageFile(null);
            setImagePreview(null);
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Failed to save batch');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (batch: Batch) => {
        setFormData({
            name: batch.name,
            description: batch.description,
            price: batch.price,
            start_date: batch.start_date,
            end_date: batch.end_date || '',
            status: batch.status,
            is_active: batch.is_active,
        });
        setEditingId(batch.id);
        setShowForm(true);
        setImageFile(null);
        setImagePreview(batch.image || null);
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        setDeletingId(id);
        try {
            await api.delete(`/batches/batches/${id}/`);
            setBatches(prev => prev.filter(b => b.id !== id));
            toast.success('Batch deleted');
        } catch {
            toast.error('Failed to delete batch');
        } finally {
            setDeletingId(null);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData(emptyForm);
        setImageFile(null);
        setImagePreview(null);
    };

    if (loading) return (
        <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Batch Management</h1>
                    <p className="text-gray-500 mt-1">Add, edit, or remove coaching batches shown on the homepage.</p>
                </div>
                <Button
                    onClick={() => { setShowForm(true); setEditingId(null); setFormData(emptyForm); }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 gap-2"
                >
                    <Plus className="w-4 h-4" /> Add New Batch
                </Button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">
                            {editingId ? 'Edit Batch' : 'Add New Batch'}
                        </h2>
                        <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Batch Name *</label>
                            <Input
                                placeholder="e.g. Batch 12 - July 2025"
                                value={formData.name}
                                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Price (BDT) *</label>
                            <Input
                                type="number"
                                placeholder="e.g. 1000"
                                value={formData.price}
                                onChange={e => setFormData(p => ({ ...p, price: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Start Date *</label>
                            <Input
                                type="date"
                                value={formData.start_date}
                                onChange={e => setFormData(p => ({ ...p, start_date: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">End Date</label>
                            <Input
                                type="date"
                                value={formData.end_date}
                                onChange={e => setFormData(p => ({ ...p, end_date: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Status</label>
                            <select
                                value={formData.status}
                                onChange={e => setFormData(p => ({ ...p, status: e.target.value as any }))}
                                className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400"
                            >
                                <option value="upcoming">Upcoming</option>
                                <option value="running">Running</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div className="space-y-1.5 flex items-center gap-3 pt-6">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={e => setFormData(p => ({ ...p, is_active: e.target.checked }))}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600"
                            />
                            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                                Show on homepage (Active)
                            </label>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Batch Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                    const file = e.target.files?.[0] || null;
                                    setImageFile(file);
                                    if (file) {
                                        setImagePreview(URL.createObjectURL(file));
                                    } else {
                                        setImagePreview(null);
                                    }
                                }}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {imagePreview && (
                                <img src={imagePreview} alt="Batch preview" className="w-full h-40 object-cover rounded-2xl border border-gray-200 mt-3" />
                            )}
                        </div>

                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                rows={3}
                                placeholder="Describe what this batch covers, schedule, etc."
                                value={formData.description}
                                onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                                className="flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <Button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 gap-2"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            {editingId ? 'Save Changes' : 'Create Batch'}
                        </Button>
                        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    </div>
                </div>
            )}

            {/* Batch list */}
            {batches.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No batches yet</p>
                    <p className="text-gray-400 text-sm mt-1">Click "Add New Batch" to create your first batch.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {batches.map(batch => {
                        const config = STATUS_CONFIG[batch.status];
                        return (
                            <div key={batch.id} className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${!batch.is_active ? 'opacity-60' : ''}`}>
                                <div className={`h-1 w-full bg-gradient-to-r ${batch.status === 'running' ? 'from-green-500 to-emerald-500' : batch.status === 'upcoming' ? 'from-yellow-500 to-orange-500' : 'from-gray-400 to-gray-500'}`} />
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${config.bg} ${config.color} ${config.border} border flex items-center gap-1`}>
                                            <config.icon className="w-3 h-3" />
                                            {config.label}
                                        </span>
                                        {!batch.is_active && (
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">Hidden</span>
                                        )}
                                    </div>

                                    <h3 className="font-bold text-gray-900 mb-2">{batch.name}</h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{batch.description}</p>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Tag className="w-4 h-4 text-blue-500" />
                                            <span className="font-semibold text-blue-600">৳{batch.price} BDT</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            <span>Starts: {new Date(batch.start_date).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        </div>
                                        {batch.end_date && (
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                <span>Ends: {new Date(batch.end_date).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(batch)}
                                            className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 gap-1.5"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" /> Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(batch.id, batch.name)}
                                            disabled={deletingId === batch.id}
                                            className="flex-1 border-red-200 text-red-500 hover:bg-red-50 gap-1.5"
                                        >
                                            {deletingId === batch.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
