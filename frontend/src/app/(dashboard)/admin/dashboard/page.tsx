'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, AlertCircle, TrendingUp, CheckCircle, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [slowLoadId, setSlowLoadId] = useState<string | number | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const timer = setTimeout(() => {
                const id = toast.info('Admin dashboard is loading...', {
                    description: 'Our backend might be waking up from sleep. This will only take a moment.',
                    duration: 10000,
                });
                setSlowLoadId(id);
            }, 5000);

            try {
                const res = await api.get('/auth/dashboard-stats/');
                setData(res.data);
                clearTimeout(timer);
                if (slowLoadId) toast.dismiss(slowLoadId);
            } catch (err) {
                clearTimeout(timer);
                if (slowLoadId) toast.dismiss(slowLoadId);
                console.error("Failed to fetch dashboard stats:", err);
                toast.error("Failed to load dashboard statistics.", {
                    duration: 8000
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                <p className="text-gray-500 font-medium text-lg">Loading dashboard statistics...</p>
            </div>
        );
    }

    const { stats, registration_data, revenue_data, recent_payments, pending_students, top_performers, test_stats } = data || {
        stats: {
            total_students: 0,
            total_tests: 0,
            pending_payments: 0,
            total_revenue: 0,
            paid_students: 0,
            free_students: 0,
            this_month_enrollments: 0,
            active_students: 0,
        },
        registration_data: [],
        revenue_data: [],
        recent_payments: [],
        pending_students: [],
        top_performers: [],
        test_stats: []
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-sky-500/15 to-transparent" />
                <div className="absolute right-10 top-10 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
                <div className="absolute left-8 bottom-8 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-1000" />
                <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-sm font-semibold text-sky-200 backdrop-blur-sm mb-4">
                            Admin Dashboard
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Welcome back, Admin</h1>
                        <p className="mt-4 max-w-2xl text-slate-300 text-lg">A modern, data-driven control panel with the same premium visual energy as the home page.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-3xl border border-slate-800/90 bg-slate-900/85 px-4 py-3 shadow-inner shadow-slate-950/10">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Active</p>
                            <p className="mt-1 text-lg font-semibold text-white">Healthy</p>
                        </div>
                        <div className="rounded-3xl border border-slate-800/90 bg-slate-900/85 px-4 py-3 shadow-inner shadow-slate-950/10">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Theme</p>
                            <p className="mt-1 text-lg font-semibold text-white">Dark</p>
                        </div>
                        <div className="rounded-3xl border border-slate-800/90 bg-slate-900/85 px-4 py-3 shadow-inner shadow-slate-950/10">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Latency</p>
                            <p className="mt-1 text-lg font-semibold text-white"><span className="text-sky-400">60ms</span></p>
                        </div>
                        <div className="rounded-3xl border border-slate-800/90 bg-slate-900/85 px-4 py-3 shadow-inner shadow-slate-950/10">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Realtime</p>
                            <p className="mt-1 text-lg font-semibold text-white">Live</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="shadow-sm hover:shadow-xl transition-shadow duration-300 bg-slate-950/95 border border-slate-800 shadow-slate-950/40">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/10">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium uppercase tracking-wider text-slate-400">Total Students</p>
                            <h3 className="text-2xl font-bold text-white">{stats.total_students.toLocaleString()}</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-xl transition-shadow duration-300 bg-slate-950/95 border border-slate-800 shadow-slate-950/40">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 text-white shadow-lg shadow-amber-500/10">
                            <AlertCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium uppercase tracking-wider text-slate-400">Pending Payments</p>
                            <h3 className="text-2xl font-bold text-white">{stats.pending_payments}</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-xl transition-shadow duration-300 bg-slate-950/95 border border-slate-800 shadow-slate-950/40">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/10">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium uppercase tracking-wider text-slate-400">Total Tests</p>
                            <h3 className="text-2xl font-bold text-white">{stats.total_tests}</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-xl transition-shadow duration-300 bg-slate-950/95 border border-slate-800 shadow-slate-950/40">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/10">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium uppercase tracking-wider text-slate-400">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-white">৳{stats.total_revenue.toLocaleString()}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Registration Chart */}
                <Card className="shadow-sm hover:shadow-xl transition-shadow duration-300 bg-slate-950/95 border border-slate-800 shadow-slate-950/40">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-white">New Registrations (Last 7 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="text-slate-300">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={registration_data}>
                                    <defs>
                                        <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorStudents)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Actions */}
                <Card className="shadow-sm hover:shadow-xl transition-shadow duration-300 bg-slate-950/95 border border-slate-800 shadow-slate-950/40">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-white">Recent Payment Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="text-slate-300">
                        <div className="space-y-4">
                            {recent_payments.length > 0 ? (
                                recent_payments.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between border-b border-slate-800/70 pb-4 last:border-0 last:pb-0 hover:bg-slate-950/80 p-2 rounded-xl transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-100 border border-slate-700">
                                                {item.full_name?.charAt(0) || item.username?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{item.full_name || item.username}</p>
                                                <p className="text-xs text-slate-400">{item.username} • {item.enrollment_date || 'No date'}</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-emerald-400">৳{item.amount_paid.toFixed(2)}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                    <p>No recent payments found</p>
                                </div>
                            )}
                        </div>
                        <Link href="/admin/users">
                            <Button className="w-full mt-6 bg-slate-900 text-white hover:bg-slate-800" variant="secondary">Manage Users</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card className="shadow-sm hover:shadow-xl transition-shadow duration-300 bg-slate-950/95 border border-slate-800 shadow-slate-950/40">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-white">Pending Students</CardTitle>
                        <span className="text-sm text-slate-400">{pending_students.length} pending</span>
                    </CardHeader>
                    <CardContent className="space-y-4 text-slate-300">
                        {pending_students.length === 0 ? (
                            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center text-slate-500">No pending students found.</div>
                        ) : (
                            pending_students.slice(0, 5).map((student: any) => (
                                <div key={student.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-white">{student.full_name || student.username}</p>
                                            <p className="text-xs text-slate-400">@{student.username} • {student.email || student.phone || 'No contact'}</p>
                                        </div>
                                        <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300">Pending</span>
                                    </div>
                                    <p className="mt-3 text-sm text-slate-400">{student.payment_note || 'Awaiting payment verification.'}</p>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-xl transition-shadow duration-300 bg-slate-950/95 border border-slate-800 shadow-slate-950/40">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-white">Top Performers</CardTitle>
                        <span className="text-sm text-slate-400">{top_performers.length} students</span>
                    </CardHeader>
                    <CardContent className="space-y-4 text-slate-300">
                        {top_performers.length === 0 ? (
                            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center text-slate-500">No performance data available.</div>
                        ) : (
                            top_performers.map((user: any) => (
                                <div key={user.username} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-white">{user.full_name || user.username}</p>
                                            <p className="text-xs text-slate-400">@{user.username}</p>
                                        </div>
                                        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">{user.average_score.toFixed(1)}%</span>
                                    </div>
                                    <div className="mt-3 grid gap-2 text-sm text-slate-400">
                                        <p>Tests taken: {user.tests_taken}</p>
                                        <p>Highest score: {user.highest_score.toFixed(1)}%</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
