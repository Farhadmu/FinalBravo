"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Brain, Edit, Trash2 } from "lucide-react";
import api from '@/lib/api';
import { toast } from 'sonner';

interface Test {
    id: string;
    name: string;
    description: string;
    duration_minutes: number;
    total_questions: number;
    is_free: boolean;
    price: string;
    is_active: boolean;
    passing_score: number;
    created_at: string;
    updated_at: string;
}

export default function ViewTestPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [test, setTest] = useState<Test | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchTest = async (testId: string) => {
        try {
            const res = await api.get(`/tests/tests/${testId}/`);
            setTest(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load test details.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchTest(id);
        }
    }, [id]);

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    if (!test) return <div className="p-8 text-center text-red-500">Test not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/admin/tests')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Test Details</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push(`/admin/questions?test_id=${id}`)}>
                        Manage Questions
                    </Button>
                    <Button variant="outline" onClick={() => router.push(`/admin/tests/${id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Test
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-600">
                            <Brain className="h-5 w-5" />
                            General Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Test Name</label>
                            <p className="text-xl font-semibold text-gray-900">{test.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Description</label>
                            <p className="text-gray-600 whitespace-pre-wrap">{test.description || 'No description provided.'}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-500">Duration</span>
                            <span className="font-medium">{test.duration_minutes} mins</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-500">Questions</span>
                            <span className="font-medium">{test.total_questions} Qs</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-500">Passing Score</span>
                            <span className="font-medium">{test.passing_score}%</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-500">Price</span>
                            <span className="font-medium">
                                {parseFloat(test.price) === 0 ? 'Free' : `৳${test.price}`}
                            </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-500">Type</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${test.is_free ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                {test.is_free ? 'Sample' : 'Standard'}
                            </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-500">Status</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${test.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {test.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Metadata</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Created At</label>
                            <p className="text-sm">{new Date(test.created_at).toLocaleString()}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Last Updated</label>
                            <p className="text-sm">{new Date(test.updated_at).toLocaleString()}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
