'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Shield, KeyRound, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';

import { toast } from 'sonner';

export default function ProfilePage() {
    const { user, updateUser } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const [profileData, setProfileData] = useState({
        full_name: '',
        email: '',
        phone: '',
        username: ''
    });

    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await api.get('/auth/users/me/');
                const data = res.data;
                setProfileData({
                    full_name: data.full_name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    username: data.username || ''
                });
                updateUser(data);
            } catch (err) {
                console.error("Failed to fetch profile data:", err);
            } finally {
                setPageLoading(false);
            }
        };

        fetchUserData();
    }, [updateUser]);

    const extractErrors = (data: any): string => {
        if (!data) return "An unknown error occurred.";
        if (typeof data === 'string') return data;
        if (data.detail) return data.detail;
        if (data.error) return data.error;

        // Handle field-specific errors
        const errorMessages = Object.entries(data).map(([key, value]) => {
            const message = Array.isArray(value) ? value[0] : value;
            return `${key.replace(/_/g, ' ')}: ${message}`;
        });

        if (errorMessages.length > 0) return errorMessages.join(' | ');
        return "Failed to complete request. Please try again.";
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.patch(`/auth/users/me/`, {
                full_name: profileData.full_name,
                phone: profileData.phone
            });
            updateUser(res.data);
            toast.success("Profile updated successfully!");
        } catch (err: any) {
            toast.error(extractErrors(err.response?.data));
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (passwordData.new_password !== passwordData.confirm_password) {
            toast.error("New passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            await api.post('/auth/users/change_password/', {
                old_password: passwordData.old_password,
                new_password: passwordData.new_password
            });
            toast.success("Password updated successfully!");
            setPasswordData({
                old_password: '',
                new_password: '',
                confirm_password: ''
            });
        } catch (err: any) {
            toast.error(extractErrors(err.response?.data));
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                <p className="text-gray-500 font-medium text-lg">Loading your profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 text-slate-100">
            <div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight">Profile Settings</h1>
                <p className="text-slate-400 mt-2 text-lg">Manage your personal information and security settings.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                    <Card className="overflow-hidden border border-slate-800 bg-slate-950/95 shadow-2xl shadow-slate-950/40">
                        <div className="h-32 bg-gradient-to-r from-sky-700 via-indigo-800 to-violet-900" />
                        <CardContent className="relative pt-0 pb-8 text-center">
                            <div className="flex justify-center">
                                <div className="absolute -top-12 h-24 w-24 rounded-full border-4 border-slate-950 bg-slate-900 shadow-xl overflow-hidden flex items-center justify-center">
                                    <div className="h-full w-full bg-slate-800 flex items-center justify-center text-slate-100 text-4xl font-black uppercase">
                                        {profileData.username?.charAt(0)}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-16 space-y-1">
                                <h2 className="text-2xl font-bold text-white">{profileData.full_name || profileData.username}</h2>
                                <p className="text-slate-400 font-medium">@{profileData.username}</p>
                                <div className="pt-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-200 uppercase tracking-wider">
                                        {user?.role}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-slate-800 bg-slate-950/95 shadow-2xl shadow-slate-950/40">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-sky-600/10 rounded-lg text-sky-300">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Security Level: Medium</h4>
                                    <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                                        Your account is active. We recommend changing your password every 90 days for maximum safety.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <Card className="border border-slate-800 bg-slate-950/95 shadow-2xl shadow-slate-950/40 overflow-hidden">
                        <CardHeader className="bg-slate-900/80 border-b border-slate-800">
                            <CardTitle className="flex items-center gap-2 text-xl text-white">
                                <User className="h-5 w-5 text-sky-300" />
                                Personal Information
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Update your contact details and full name.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="full_name" className="text-sm font-bold text-slate-200">Full Name</Label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-sky-400 transition-colors">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <Input
                                                id="full_name"
                                                className="pl-10 h-11 bg-slate-900 text-slate-100 border-slate-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                placeholder="Enter your full name"
                                                value={profileData.full_name}
                                                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="username" className="text-sm font-bold text-slate-200">Username</Label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                                <div className="text-sm font-bold">@</div>
                                            </div>
                                            <Input
                                                id="username"
                                                disabled
                                                className="pl-8 h-11 bg-slate-900 text-slate-500 border-slate-700"
                                                value={profileData.username}
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-medium italic">Usernames are chosen during registration and cannot be changed.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-bold text-slate-200">Email Address</Label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-sky-400 transition-colors">
                                                <Mail className="h-4 w-4" />
                                            </div>
                                            <Input
                                                id="email"
                                                disabled
                                                className="pl-10 h-11 bg-slate-900 text-slate-500 border-slate-700"
                                                value={profileData.email}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm font-bold text-slate-200">Phone Number</Label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-sky-400 transition-colors">
                                                <Phone className="h-4 w-4" />
                                            </div>
                                            <Input
                                                id="phone"
                                                className="pl-10 h-11 bg-slate-900 text-slate-100 border-slate-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                placeholder="+1 (555) 000-0000"
                                                value={profileData.phone}
                                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button
                                        type="submit"
                                        className="h-11 px-8 font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-lg hover:shadow-xl transition-all"
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="border border-slate-800 bg-slate-950/95 shadow-2xl shadow-slate-950/40 overflow-hidden">
                        <CardHeader className="bg-slate-900/80 border-b border-slate-800">
                            <CardTitle className="flex items-center gap-2 text-xl text-white">
                                <KeyRound className="h-5 w-5 text-sky-300" />
                                Security Settings
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Secure your account by updating your login password.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="old_password" className="text-sm font-medium text-slate-200">Current Password</Label>
                                    <Input
                                        id="old_password"
                                        type="password"
                                        className="h-11 bg-slate-900 text-slate-100 border-slate-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                        required
                                        value={passwordData.old_password}
                                        onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="new_password" className="text-sm font-medium text-slate-200">New Password</Label>
                                        <Input
                                            id="new_password"
                                            type="password"
                                            className="h-11 bg-slate-900 text-slate-100 border-slate-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                            placeholder="Min. 8 characters"
                                            required
                                            value={passwordData.new_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm_password" className="text-sm font-medium text-slate-200">Confirm New Password</Label>
                                        <Input
                                            id="confirm_password"
                                            type="password"
                                            className="h-11 bg-slate-900 text-slate-100 border-slate-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                            required
                                            value={passwordData.confirm_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button
                                        type="submit"
                                        variant="secondary"
                                        className="h-11 px-8 font-bold border-2 border-slate-700 text-slate-100 hover:border-slate-500"
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                        Update Password
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
