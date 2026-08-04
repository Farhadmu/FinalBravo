"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import {
    Brain,
    CheckCircle,
    Trophy,
    ArrowRight,
    Target,
    Zap,
    Clock,
    Loader2,
    Star,
    ShieldCheck,
    
} from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";

interface ResultItem {
    id: string;
    test_name: string;
    test_category?: string;
    created_at: string;
    score_percentage: number;
    passed: boolean;
    time_taken_seconds: number;
    accuracy: number;
}

interface CategoryBreakdown {
    avg_score: number;
    count: number;
}

interface Analytics {
    total_tests_taken: number;
    total_tests_passed: number;
    average_score: number;
    average_accuracy: number;
    highest_score: number;
    lowest_score?: number;
    average_time_taken: number;
    total_time_spent: number;
    average_questions_answered: number;
    pass_rate: number;
    improvement: number;
    category_breakdown: {
        verbal: CategoryBreakdown;
        non_verbal: CategoryBreakdown;
        wat: { count: number };
    };
    recent_results: ResultItem[];
    score_trend: { test_number: number; score_percentage: number; passed: boolean }[];
    wat_completion_rate: number;
}

const STAT_CARDS = [
    { title: "Tests Taken", icon: Brain, color: "from-sky-500 to-cyan-500", valueKey: "total_tests_taken" },
    { title: "Average Score", icon: Trophy, color: "from-amber-500 to-yellow-500", valueKey: "average_score", suffix: "%" },
    { title: "Best Score", icon: Star, color: "from-violet-500 to-fuchsia-500", valueKey: "highest_score", suffix: "%" },
    { title: "Pass Rate", icon: CheckCircle, color: "from-emerald-500 to-teal-500", valueKey: "pass_rate", suffix: "%" },
    { title: "Total Time", icon: Clock, color: "from-orange-500 to-amber-500", valueKey: "total_time_spent", time: true },
    { title: "Avg Time/Test", icon: Clock, color: "from-cyan-500 to-sky-500", valueKey: "average_time_taken", time: true },
];

export default function StudentDashboardPage() {
    const { user } = useAuthStore();
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get("/results/analytics/");
                setAnalytics(res.data);
            } catch (err) {
                console.error("Failed to load analytics:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const motivationText = analytics
        ? analytics.total_tests_taken === 0
            ? "শুরু করো! প্রথম test দাও"
            : analytics.average_score >= 70
            ? "দারুণ! চালিয়ে যাও!"
            : analytics.average_score < 50
            ? "আরো practice করো!"
            : "চমৎকার প্রগতির পথে রয়েছো!"
        : "Loading...";

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-center">
                    <Loader2 className="h-12 w-12 text-sky-500 animate-spin" />
                    <p className="text-slate-500">Loading dashboard analytics...</p>
                </div>
            </div>
        );
    }

    const scoreTrendData = analytics?.score_trend.map((item) => ({ name: `#${item.test_number}`, score: item.score_percentage })) ?? [];

    const categoryChartData = analytics
        ? [
                { name: "Verbal", value: analytics.category_breakdown.verbal.avg_score, color: "#38bdf8" },
                { name: "Non-Verbal", value: analytics.category_breakdown.non_verbal.avg_score, color: "#8b5cf6" },
                { name: "WAT", value: analytics.wat_completion_rate, color: "#f97316" },
            ]
        : [];

    return (
        <div className="space-y-8 bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">Dashboard Overview</p>
                <h1 className="mt-4 text-4xl font-extrabold text-slate-950">Bravo Academy</h1>
                <p className="mt-3 text-slate-600 max-w-3xl">Your progress summary, performance insights, and quick test actions are all available here for faster improvement.</p>
            </section>

            <div className="grid gap-4 lg:grid-cols-3">
                {STAT_CARDS.map((card) => {
                    const value = analytics ? (card.time ? formatTime((analytics as any)[card.valueKey]) : `${((analytics as any)[card.valueKey] ?? 0).toFixed(card.suffix ? 1 : 0)}${card.suffix ?? ""}`) : "0";
                    return (
                        <div key={card.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.18em] text-slate-500">{card.title}</p>
                                    <p className="mt-4 text-3xl font-bold text-slate-950">{value}</p>
                                </div>
                                <div className={`flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br ${card.color} text-white`}>
                                    <card.icon className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-950">Score Trend</h2>
                            <p className="text-sm text-slate-500">Last 10 test scores with pass threshold.</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">50% pass line</span>
                    </div>
                    <div className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={scoreTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#0f172a" stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} labelStyle={{ color: '#fff' }} />
                                <ReferenceLine y={50} stroke="#facc15" strokeDasharray="3 3" />
                                <Area type="monotone" dataKey="score" stroke="#38bdf8" fillOpacity={1} fill="url(#scoreGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200">
                    <h2 className="text-xl font-bold text-slate-950 mb-4">Profile Summary</h2>
                    <div className="space-y-4">
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">Username</p>
                            <p className="mt-2 text-lg font-semibold text-slate-950">{user?.username}</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">Enrollment Date</p>
                            <p className="mt-2 text-lg font-semibold text-slate-950">{user?.enrollment_date ?? 'Not set'}</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">Payment Status</p>
                            <p className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">{user?.payment_status ?? 'Unknown'}</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">Total Practice Time</p>
                            <p className="mt-2 text-lg font-semibold text-slate-950">{analytics ? formatTime(analytics.total_time_spent) : '00:00'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-950">Category Performance</h2>
                            <p className="text-sm text-slate-500">Compare category averages and WAT progress.</p>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3 mb-6">
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">Verbal IQ Avg</p>
                            <p className="mt-3 text-3xl font-bold text-slate-950">{analytics?.category_breakdown.verbal.avg_score.toFixed(1) ?? '0.0'}%</p>
                            <p className="text-xs text-slate-400 mt-2">{analytics?.category_breakdown.verbal.count ?? 0} tests</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">Non-Verbal IQ Avg</p>
                            <p className="mt-3 text-3xl font-bold text-slate-950">{analytics?.category_breakdown.non_verbal.avg_score.toFixed(1) ?? '0.0'}%</p>
                            <p className="text-xs text-slate-400 mt-2">{analytics?.category_breakdown.non_verbal.count ?? 0} tests</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">WAT Completion</p>
                            <p className="mt-3 text-3xl font-bold text-slate-950">{analytics?.wat_completion_rate.toFixed(1) ?? '0.0'}%</p>
                            <p className="text-xs text-slate-400 mt-2">{analytics?.category_breakdown.wat.count ?? 0} WAT tests</p>
                        </div>
                    </div>
                    <div className="h-72 rounded-[1.5rem] bg-slate-50 p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryChartData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} labelStyle={{ color: '#fff' }} />
                                <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                                    {categoryChartData.map((entry) => (
                                        <Cell key={entry.name} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200">
                    <h2 className="text-xl font-bold text-slate-950 mb-4">Motivational Section</h2>
                    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-600">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Motivation</p>
                                <p className="mt-2 text-lg font-semibold text-slate-950">{motivationText}</p>
                            </div>
                        </div>
                        <div className="rounded-[1.5rem] bg-white p-4 border border-slate-200">
                            <p className="text-sm text-slate-500">Improvement</p>
                            <p className="mt-2 text-3xl font-bold text-slate-950">{analytics ? `${analytics.improvement >= 0 ? '+' : ''}${analytics.improvement}%` : '0%'}</p>
                            <p className="text-xs text-slate-400 mt-1">From first test to latest</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 flex items-center justify-between">
                            <span className="text-sm text-slate-500">Average Accuracy</span>
                            <span className="font-semibold text-slate-950">{analytics?.average_accuracy.toFixed(1) ?? 0}%</span>
                        </div>
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 flex items-center justify-between">
                            <span className="text-sm text-slate-500">Best Score</span>
                            <span className="font-semibold text-slate-950">{analytics?.highest_score.toFixed(1) ?? 0}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-950">Recent Activity</h2>
                        <p className="text-sm text-slate-500">Last 5 results with quick analysis.</p>
                    </div>
                    <Link href="/dashboard/results">
                        <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-100 gap-1.5">
                            View All <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                    </Link>
                </div>
                <div className="grid gap-4">
                    {analytics?.recent_results.length ? (
                        analytics.recent_results.map((result) => (
                            <div key={result.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 sm:flex sm:items-center sm:justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-slate-950">{result.test_name}</p>
                                    <p className="text-xs text-slate-500 mt-1">{new Date(result.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${result.passed ? 'bg-emerald-500/10 text-emerald-700' : 'bg-rose-500/10 text-rose-700'}`}>{result.passed ? 'Passed' : 'Failed'}</span>
                                    <span className="text-sm font-semibold text-slate-950">{result.score_percentage}%</span>
                                    <span className="text-sm text-slate-500">{formatTime(result.time_taken_seconds)}</span>
                                    <Link href={`/dashboard/results/${result.id}`}>
                                        <Button size="sm" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">View Analysis</Button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">No recent results found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}