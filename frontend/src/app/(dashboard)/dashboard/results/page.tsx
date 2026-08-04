'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    Brain,
    CheckCircle,
    Trophy,
    ArrowRight,
    Target,
    Zap,
    Clock,
    Calendar,
    Loader2,
} from "lucide-react";
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';

interface Result {
    id: string;
    test_name: string;
    test_category?: string;
    created_at: string;
    score_percentage: string;
    passed: boolean;
    total_questions: number;
    time_taken_seconds: number;
}

interface TestItem {
    id: string;
    name: string;
    category: 'verbal' | 'non-verbal' | 'wat';
    duration_minutes: number;
    total_questions: number;
    is_free: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
    'verbal': 'Verbal IQ',
    'non-verbal': 'Non-Verbal IQ',
    'wat': 'Word Association (WAT)',
};

const CATEGORY_CONFIG: Record<string, { gradient: string; icon: any }> = {
    'verbal': { gradient: 'from-blue-500 to-cyan-500', icon: Brain },
    'non-verbal': { gradient: 'from-purple-500 to-pink-500', icon: Target },
    'wat': { gradient: 'from-orange-500 to-red-500', icon: Zap },
};

export default function StudentDashboardPage() {
    const { user } = useAuthStore();
    const [results, setResults] = useState<Result[]>([]);
    const [tests, setTests] = useState<TestItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resultsRes, testsRes] = await Promise.allSettled([
                    api.get('/results/results/'),
                    api.get('/tests/tests/'),
                ]);

                if (resultsRes.status === 'fulfilled') {
                    const data = resultsRes.value.data.results || resultsRes.value.data;
                    setResults(Array.isArray(data) ? data : []);
                }

                if (testsRes.status === 'fulfilled') {
                    const data = testsRes.value.data.results || testsRes.value.data;
                    setTests(Array.isArray(data) ? data : []);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-10 w-10 text-sky-400 animate-spin" />
                <p className="text-slate-400 font-medium">Loading your dashboard...</p>
            </div>
        );
    }

    const passedCount = results.filter((r) => r.passed).length;
    const avgScore = results.length > 0
        ? (results.reduce((acc, r) => acc + parseFloat(r.score_percentage), 0) / results.length).toFixed(1)
        : '0';
    const recentResults = [...results]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-8">
            {/* Hero */}
            <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/40">
                <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl" />
                <div className="absolute -right-16 bottom-10 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
                <div className="relative">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-300/80 mb-3">
                        Student Dashboard
                    </p>
                    <h1 className="text-4xl font-extrabold text-white">
                        Welcome back, {user?.full_name || user?.username}!
                    </h1>
                    <p className="mt-3 max-w-2xl text-slate-400 leading-relaxed">
                        Track your progress, jump back into practice, and review your latest results — all in one place.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/95 p-6 shadow-sm shadow-slate-950/20">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-300 mb-4">
                        <Brain className="w-5 h-5" />
                    </div>
                    <div className="text-3xl font-extrabold text-white">{results.length}</div>
                    <div className="mt-2 text-sm text-slate-400 uppercase tracking-[0.2em]">Tests Taken</div>
                </div>
                <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/95 p-6 shadow-sm shadow-slate-950/20">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-300 mb-4">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                    <div className="text-3xl font-extrabold text-white">{passedCount}</div>
                    <div className="mt-2 text-sm text-slate-400 uppercase tracking-[0.2em]">Tests Passed</div>
                </div>
                <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/95 p-6 shadow-sm shadow-slate-950/20">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-violet-500/10 text-violet-300 mb-4">
                        <Trophy className="w-5 h-5" />
                    </div>
                    <div className="text-3xl font-extrabold text-white">{avgScore}%</div>
                    <div className="mt-2 text-sm text-slate-400 uppercase tracking-[0.2em]">Avg Score</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Practice Categories */}
                <div className="lg:col-span-2 rounded-[1.75rem] border border-slate-800 bg-slate-950/95 p-6 shadow-sm shadow-slate-950/20">
                    <h2 className="font-bold text-white mb-4">Start Practicing</h2>
                    <div className="grid sm:grid-cols-3 gap-4">
                        {Object.keys(CATEGORY_LABELS).map((cat) => {
                            const config = CATEGORY_CONFIG[cat];
                            const count = tests.filter((t) => t.category === cat).length;
                            return (
                                <Link key={cat} href={`/dashboard/tests?category=${cat}`}>
                                    <div className="h-full rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-sky-500/40 transition-all duration-200 group">
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${config.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                                            <config.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <p className="font-semibold text-white text-sm">{CATEGORY_LABELS[cat]}</p>
                                        <p className="text-xs text-slate-400 mt-1">{count} test{count !== 1 ? 's' : ''} available</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/95 p-6 space-y-3 shadow-sm shadow-slate-950/20">
                    <h2 className="font-bold text-white mb-1">Quick Links</h2>
                    <Link href="/dashboard/tests">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-90 transition-opacity cursor-pointer">
                            <span className="text-sm font-medium text-white">Browse All Tests</span>
                            <ArrowRight className="w-4 h-4 text-white/70" />
                        </div>
                    </Link>
                    <Link href="/dashboard/results">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer">
                            <span className="text-sm font-medium text-white">View My Results</span>
                            <ArrowRight className="w-4 h-4 text-white/70" />
                        </div>
                    </Link>
                    <Link href="/dashboard/profile">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer">
                            <span className="text-sm font-medium text-white">Edit Profile</span>
                            <ArrowRight className="w-4 h-4 text-white/70" />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Recent Results */}
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/95 p-6 shadow-sm shadow-slate-950/20">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-white">Recent Results</h2>
                    <Link href="/dashboard/results">
                        <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-1.5">
                            View All <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                    </Link>
                </div>

                {recentResults.length === 0 ? (
                    <div className="text-center py-10 text-slate-500">
                        <Brain className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                        <p className="font-medium text-slate-400">No results yet</p>
                        <p className="text-sm mt-1">Take your first test to see your progress here.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentResults.map((result) => {
                            const isWatOrVerbal = result.test_category === 'wat' || result.test_category === 'verbal';
                            const score = parseFloat(result.score_percentage);
                            return (
                                <div key={result.id} className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-sky-500/30 transition-all duration-200">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${isWatOrVerbal ? 'bg-sky-500/10 text-sky-300' : result.passed ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>
                                            {isWatOrVerbal ? <CheckCircle className="w-4 h-4" /> : `${Math.round(score)}%`}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white text-sm">{result.test_name}</p>
                                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                                                <Calendar className="w-3 h-3" /> {new Date(result.created_at).toLocaleDateString()}
                                                <Clock className="w-3 h-3 ml-1" /> {formatTime(result.time_taken_seconds)}
                                            </div>
                                        </div>
                                    </div>
                                    <Link href={`/dashboard/results/${result.id}`}>
                                        <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs h-8">
                                            Analysis
                                        </Button>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}