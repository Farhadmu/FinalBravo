'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Clock, HelpCircle, ArrowRight, Loader2, Brain, Target, Zap } from "lucide-react";
import Link from 'next/link';
import api from '@/lib/api';

interface Test {
    id: string;
    name: string;
    category: 'verbal' | 'non-verbal' | 'wat';
    duration_minutes: number;
    total_questions: number;
    price: number;
    is_free: boolean;
    is_free_sample: boolean;
}

const CATEGORY_LABELS = {
    'verbal': 'Verbal IQ Tests',
    'non-verbal': 'Non-Verbal IQ Tests',
    'wat': 'Word Association Tests'
};

const CATEGORY_CONFIG = {
    'verbal': { gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', icon: Brain, color: 'text-blue-600', border: 'border-blue-100' },
    'non-verbal': { gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-50', icon: Target, color: 'text-purple-600', border: 'border-purple-100' },
    'wat': { gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-50', icon: Zap, color: 'text-orange-600', border: 'border-orange-100' },
};

export default function TestsPage() {
    const searchParams = useSearchParams();
    const categoryFilter = searchParams.get('category');
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTests = async () => {
            setLoading(true);
            try {
                const res = await api.get('/tests/tests/', {
                    params: categoryFilter ? { category: categoryFilter } : {}
                });
                const testsData = res.data.results || res.data;
                setTests(Array.isArray(testsData) ? testsData : []);
                setLoading(false);
            } catch {
                setError("Failed to load tests.");
                setLoading(false);
            }
        };
        fetchTests();
    }, [categoryFilter]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading tests...</p>
        </div>
    );

    if (error) return <div className="text-center py-20 text-red-500 bg-red-50 rounded-2xl">{error}</div>;

    const categories = categoryFilter
        ? [categoryFilter as keyof typeof CATEGORY_LABELS]
        : ['verbal', 'non-verbal', 'wat'] as Array<keyof typeof CATEGORY_LABELS>;

    return (
        <div className="space-y-10">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/40">
                <h1 className="text-3xl font-bold text-white">
                    {categoryFilter ? CATEGORY_LABELS[categoryFilter as keyof typeof CATEGORY_LABELS] : 'Available Tests'}
                </h1>
                <p className="text-slate-400 mt-2">
                    {categoryFilter
                        ? `Practice your skills in ${CATEGORY_LABELS[categoryFilter as keyof typeof CATEGORY_LABELS].toLowerCase()}.`
                        : 'Select a test to begin practicing. Remember, time management is key!'}
                </p>
            </div>

            {!categoryFilter && (
                <div className="flex flex-wrap gap-3">
                    {(Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>).map((cat) => {
                        const config = CATEGORY_CONFIG[cat];
                        return (
                            <Link key={cat} href={`/dashboard/tests?category=${cat}`}>
                                <button className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${config.color} ${config.border} ${config.bg} bg-slate-950/80 hover:bg-slate-900 transition-all duration-200`}>
                                    <config.icon className="w-4 h-4" />
                                    {CATEGORY_LABELS[cat]}
                                </button>
                            </Link>
                        );
                    })}
                </div>
            )}

            {tests.length === 0 ? (
                <div className="text-center py-20 rounded-[1.75rem] border border-dashed border-slate-700 bg-slate-950/80">
                    <Brain className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-300">No tests available in this category at the moment.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {categories.map(cat => {
                        const catTests = tests.filter(t => t.category === cat);
                        if (catTests.length === 0) return null;
                        const config = CATEGORY_CONFIG[cat];

                        return (
                            <section key={cat} className="space-y-6">
                                {!categoryFilter && (
                                    <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                                        <div className={`w-9 h-9 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center`}>
                                            <config.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-white">{CATEGORY_LABELS[cat]}</h2>
                                        <span className="px-2.5 py-0.5 bg-slate-900 text-slate-400 text-xs rounded-full font-medium">{catTests.length} tests</span>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {catTests.map((test) => (
                                        <div key={test.id} className="group rounded-[1.75rem] border border-slate-800 bg-slate-950/95 shadow-sm shadow-slate-950/20 hover:border-sky-500/40 hover:shadow-slate-500/20 transition-all duration-300 overflow-hidden flex flex-col">
                                            <div className={`h-1 w-full bg-gradient-to-r ${config.gradient}`} />

                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="flex items-start justify-between mb-4 gap-3">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${test.is_free_sample ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-sky-500/10 text-sky-300 border border-sky-500/20'}`}>
                                                        {test.is_free_sample ? '✓ Free' : '★ Premium'}
                                                    </span>
                                                    {test.price > 0 && (
                                                        <span className="text-sm font-bold text-slate-300">৳{test.price}</span>
                                                    )}
                                                </div>

                                                <h3 className="text-lg font-bold text-white mb-4 flex-1">{test.name}</h3>

                                                <div className="flex items-center gap-4 text-sm text-slate-400 mb-5">
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className={`w-4 h-4 ${config.color}`} />
                                                        {test.duration_minutes} min
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <HelpCircle className={`w-4 h-4 ${config.color}`} />
                                                        {test.total_questions} questions
                                                    </span>
                                                </div>

                                                <Link href={`/dashboard/tests/${test.id}`} className="w-full mt-auto">
                                                    <Button className={`w-full gap-2 bg-gradient-to-r ${config.gradient} hover:opacity-90 text-white border-0 shadow-md transition-all duration-200 group-hover:shadow-lg`}>
                                                        Start Test <ArrowRight className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
