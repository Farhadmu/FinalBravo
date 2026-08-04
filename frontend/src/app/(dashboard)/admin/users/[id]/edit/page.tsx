'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import api from '@/lib/api';

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        full_name: '',
        role: 'student',
        is_active: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) fetchUser(id);
    }, [id]);

    const fetchUser = async (userId: string) => {
        try {
            const res = await api.get(`/auth/users/${userId}/`);
            setFormData({
                username: res.data.username,
                email: res.data.email || '',
                full_name: res.data.full_name || '',
                role: res.data.role,
                is_active: res.data.is_active
            });
            setLoading(false);
        } catch (err: any) {
            console.error(err);
            setError("Failed to fetch user");
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggleActive = () => {
        setFormData(prev => ({ ...prev, is_active: !prev.is_active }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            await api.patch(`/auth/users/${id}/`, formData);
            router.push('/admin/users');
        } catch (err: any) {
            console.error("Update failed", err);
            setError(err.response?.data ? JSON.stringify(err.response.data) : "Failed to update user");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Edit {formData.username}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm break-words">
                                {error}
                            </div>
                        )}

                        {/* Username is likely read-only or editable? Typically username is hard to change. I'll make it read-only for safety unless requested otherwise. */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-500">Username</label>
                            <Input value={formData.username} disabled />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="full_name">Full Name</label>
                            <Input
                                id="full_name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="email">Email</label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="role">Role</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="student">Student</option>
                                <option value="admin">Admin</option>
                                <option value="staff">Staff</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={handleToggleActive}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="is_active" className="text-sm font-medium">Active Account</label>
                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Changes
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
