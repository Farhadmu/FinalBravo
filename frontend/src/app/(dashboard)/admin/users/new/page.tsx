'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Save, User, CreditCard, CheckCircle, Clock, Gift } from "lucide-react";
import api from '@/lib/api';
import { toast } from 'sonner';

export default function NewUserPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        full_name: '',
        phone: '',
        role: 'student',
        is_active: true,
        payment_status: 'paid',
        amount_paid: '1000',
        enrollment_date: new Date().toISOString().split('T')[0],
        payment_note: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.full_name) {
            toast.error('Full name is required');
            return;
        }
        setLoading(true);
        try {
            const payload: any = { ...formData };
            if (!payload.username) delete payload.username;
            if (!payload.password) delete payload.password;
            if (!payload.email) delete payload.email;
            if (!payload.phone) delete payload.phone;
            if (payload.payment_status === 'pending') {
                payload.amount_paid = 0;
                payload.is_active = false;
            }

            await api.post('/auth/users/', payload);
            toast.success('Student created successfully!');
            router.push('/admin/users');
        } catch (err: any) {
            const msg = err.response?.data ? JSON.stringify(err.response.data) : 'Failed to create user';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const paymentOptions = [
        { value: 'paid', label: 'Paid ✅', desc: 'Student has paid. Access granted immediately.', icon: CheckCircle, color: 'border-green-500 bg-green-500/10 text-green-300' },
        { value: 'pending', label: 'Pending ⏳', desc: 'Payment not received yet. Access will be restricted.', icon: Clock, color: 'border-yellow-500 bg-yellow-500/10 text-yellow-300' },
        { value: 'free', label: 'Free 🎁', desc: 'Free access granted. No payment required.', icon: Gift, color: 'border-blue-500 bg-blue-500/10 text-blue-300' },
    ];

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-300 hover:text-white hover:bg-slate-800">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-white">Add New Student</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Create a student account with payment status</p>
                </div>
            </div>

            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-6 space-y-6">

                {/* Personal Info */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-400" />
                        </div>
                        <h2 className="font-semibold text-white">Personal Information</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-300">Full Name *</label>
                                <Input name="full_name" value={formData.full_name} onChange={handleChange}
                                    placeholder="e.g. Fahim Ahmed"
                                    className="bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500" />
                                <p className="text-xs text-slate-500">Username auto-generated from name</p>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-300">Phone</label>
                                <Input name="phone" value={formData.phone} onChange={handleChange}
                                    placeholder="01XXXXXXXXX"
                                    className="bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-300">Email (optional)</label>
                                <Input name="email" type="email" value={formData.email} onChange={handleChange}
                                    placeholder="student@email.com"
                                    className="bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-300">Password (optional)</label>
                                <Input name="password" type="text" value={formData.password} onChange={handleChange}
                                    placeholder="Auto-generated if empty"
                                    className="bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800" />

                {/* Payment Info */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-green-400" />
                        </div>
                        <h2 className="font-semibold text-white">Payment Status</h2>
                    </div>

                    {/* Payment Status Options */}
                    <div className="grid grid-cols-1 gap-3 mb-4">
                        {paymentOptions.map(opt => (
                            <label key={opt.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${formData.payment_status === opt.value ? opt.color : 'border-slate-700 bg-slate-900 hover:border-slate-600'}`}>
                                <input
                                    type="radio"
                                    name="payment_status"
                                    value={opt.value}
                                    checked={formData.payment_status === opt.value}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${formData.payment_status === opt.value ? 'border-current bg-current' : 'border-slate-600'}`}>
                                    {formData.payment_status === opt.value && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">{opt.label}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                                </div>
                            </label>
                        ))}
                    </div>

                    {/* Amount & Date */}
                    {formData.payment_status !== 'pending' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-300">
                                    Amount Paid (BDT)
                                </label>
                                <Input
                                    name="amount_paid"
                                    type="number"
                                    value={formData.payment_status === 'free' ? '0' : formData.amount_paid}
                                    onChange={handleChange}
                                    disabled={formData.payment_status === 'free'}
                                    placeholder="1000"
                                    className="bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-300">Enrollment Date</label>
                                <Input
                                    name="enrollment_date"
                                    type="date"
                                    value={formData.enrollment_date}
                                    onChange={handleChange}
                                    className="bg-slate-950 border-slate-700 text-slate-100 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* Note */}
                    <div className="space-y-1.5 mt-4">
                        <label className="text-sm font-medium text-slate-300">Payment Note (optional)</label>
                        <textarea
                            name="payment_note"
                            value={formData.payment_note}
                            onChange={handleChange}
                            rows={2}
                            placeholder="e.g. Paid via bKash 01979-486096, TxID: ABC123"
                            className="flex w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 resize-none"
                        />
                    </div>

                    {/* Warning for pending */}
                    {formData.payment_status === 'pending' && (
                        <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                            <p className="text-yellow-300 text-sm font-medium">⚠️ Pending Payment</p>
                            <p className="text-yellow-400/70 text-xs mt-1">
                                This student will be created but access will be restricted until payment is confirmed.
                                You can update payment status later from User Management.
                            </p>
                        </div>
                    )}
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-2">
                    <Button onClick={handleSubmit} disabled={loading}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 h-11 gap-2 shadow-lg">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {loading ? 'Creating...' : 'Create Student'}
                    </Button>
                    <Button variant="outline" onClick={() => router.back()}
                        className="border-slate-700 text-slate-300 hover:bg-slate-800 h-11">
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}
