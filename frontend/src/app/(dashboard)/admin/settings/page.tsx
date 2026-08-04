'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, ShieldCheck, AlertCircle } from "lucide-react";
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';

import { toast } from 'sonner';

export default function AdminSettingsPage() {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
    });

    const extractErrors = (data: any): string => {
        if (!data) return "An unknown error occurred.";
        if (typeof data === 'string') return data;
        if (data.detail) return data.detail;
        if (data.error) return data.error;

        const errorMessages = Object.entries(data).map(([key, value]) => {
            const message = Array.isArray(value) ? value[0] : value;
            return `${key.replace(/_/g, ' ')}: ${message}`;
        });

        if (errorMessages.length > 0) return errorMessages.join(' | ');
        return "An error occurred. Please check your credentials.";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (formData.new_password !== formData.confirm_password) {
            toast.error("New passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            await api.post('/auth/users/change_password/', {
                old_password: formData.old_password,
                new_password: formData.new_password,
            });
            toast.success("Password updated successfully!");
            setFormData({
                old_password: '',
                new_password: '',
                confirm_password: '',
            });
        } catch (err: any) {
            toast.error(extractErrors(err.response?.data));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                <p className="text-gray-600 mt-2">Manage your security preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Information Card */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Your Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl uppercase">
                                    {user?.username?.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{user?.username}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t text-sm text-gray-600">
                                <p>To change your full name or other profile details, please contact system support.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4 flex gap-3">
                            <ShieldCheck className="h-5 w-5 text-blue-600 flex-shrink-0" />
                            <p className="text-xs text-blue-800 leading-relaxed">
                                <strong>Safety Tip:</strong> Use a strong password with at least 8 characters, including numbers and special symbols.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Password Change Form */}
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <KeyRound className="h-5 w-5 text-gray-500" />
                                Change Password
                            </CardTitle>
                            <CardDescription>
                                Secure your account by updating your login password.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">

                                <div className="space-y-2">
                                    <Label htmlFor="old_password">Current Password</Label>
                                    <Input
                                        id="old_password"
                                        type="password"
                                        placeholder="Enter your current password"
                                        required
                                        value={formData.old_password}
                                        onChange={(e) => setFormData({ ...formData, old_password: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="new_password">New Password</Label>
                                        <Input
                                            id="new_password"
                                            type="password"
                                            placeholder="Min. 8 characters"
                                            required
                                            value={formData.new_password}
                                            onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm_password">Confirm New Password</Label>
                                        <Input
                                            id="confirm_password"
                                            type="password"
                                            placeholder="Re-type new password"
                                            required
                                            value={formData.confirm_password}
                                            onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        className="w-full md:w-auto px-8"
                                        disabled={loading}
                                    >
                                        {loading ? "Updating..." : "Update Password"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
