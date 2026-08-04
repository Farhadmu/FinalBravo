"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import api from '@/lib/api';

export default function ViewUserPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async (userId: string) => {
        try {
            const res = await api.get(`/auth/users/${userId}/`);
            setUser(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            const t = setTimeout(() => fetchUser(id), 0);
            return () => clearTimeout(t);
        }
    }, [id]);


    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    if (!user) return <div className="p-8 text-center text-red-500">User not found</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{user.username}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Full Name</label>
                            <p className="text-base">{user.full_name || '-'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <p className="text-base">{user.email || '-'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Role</label>
                            <p className="capitalize">{user.role}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Status</label>
                            <p>{user.is_active ? 'Active' : 'Inactive'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Date Joined</label>
                            <p>{new Date(user.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Last Login</label>
                            <p>{user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
