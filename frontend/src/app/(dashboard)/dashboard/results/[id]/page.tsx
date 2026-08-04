'use client';
// Build Version: 1.0.4-FORCE-DEPLOY

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowLeft, BarChart2, Loader2, Clock, Calendar } from "lucide-react";
import Link from 'next/link';
import api from '@/lib/api';

interface ReviewItem {
    id: string;
    question_text: string;
    options: { id: string; text: string }[];
    correct_answer: string;
    user_answer: string | null;
    explanation: string;
    is_correct: boolean;
}

interface ResultDetail {
    id: string;
    test_name: string;
    test_category?: 'verbal' | 'non-verbal' | 'wat';
    question_type?: 'wat' | 'mcq' | 'true_false';
    score_percentage: string;
    passed: boolean;
    total_questions: number;
    correct_answers: number;
    wrong_answers: number;
    unanswered: number;
    time_taken_seconds: number;
    accuracy: string;
    created_at: string;
    review_data?: ReviewItem[];
}

export default function ResultDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = React.use(params);
    const id = unwrappedParams.id;
    const [result, setResult] = useState<ResultDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await api.get(`/results/results/${id}/`);
                setResult(res.data);
                setLoading(false);
            } catch (err: any) {
                console.error("Failed to load result:", err);
                setError(err.response?.data?.detail || "Failed to load result. Please try again.");
                setLoading(false);
            }
        };

        fetchResult();
    }, [id]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>;
    if (error) return <div className="text-center py-20 text-red-600">{error}</div>;
    if (!result) return <div className="text-center py-20">Result not found.</div>;

    const accuracy = parseFloat(result.accuracy || '0');


    // Only WAT tests use the non-graded view (no scorecard)
    // Verbal and Non-Verbal tests should use the standard graded view
    // Defensive check: If test_category is missing, check the test name
    const isNonGraded = result.test_category === 'wat' ||
        (result.test_category === undefined && result.test_name.toLowerCase().includes('wat'));

    if (isNonGraded) {
        const title = 'WAT Completed';
        const words = result.review_data?.map(item => item.question_text) || [];

        return (
            <div className="space-y-8 pb-20">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/results">
                        <Button variant="ghost" className="text-slate-200 hover:text-white"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Results</Button>
                    </Link>
                </div>

                <div className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 text-center shadow-2xl shadow-slate-950/40">
                    <div className="inline-flex items-center justify-center p-4 rounded-full mb-4 bg-sky-500/10 text-sky-300">
                        <CheckCircle className="w-12 h-12" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
                    <p className="text-slate-400">You have completed {result.test_name}</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(result.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTime(result.time_taken_seconds)}</span>
                    </div>
                </div>

                {result.question_type === 'wat' && (
                    <Card className="border border-slate-800 bg-slate-950/95 shadow-2xl shadow-slate-950/40">
                        <CardHeader className="bg-slate-900/80 border-b border-slate-800">
                            <CardTitle className="text-white">Word List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {words.map((word, idx) => (
                                    <div key={idx} className="p-3 rounded-2xl border border-slate-800 bg-slate-900 text-center font-medium text-slate-200">
                                        {idx + 1}. {word}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/results">
                    <Button variant="ghost" className="text-slate-200 hover:text-white"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Results</Button>
                </Link>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 text-center shadow-2xl shadow-slate-950/40">
                <div className={`inline-flex items-center justify-center p-4 rounded-full mb-4 ${result.passed ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>
                    {result.passed ? <CheckCircle className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">{result.passed ? 'Congratulations! You Passed' : 'Keep Practicing'}</h1>
                <p className="text-slate-400">You scored {parseFloat(result.score_percentage).toFixed(1)}% in {result.test_name}</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(result.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTime(result.time_taken_seconds)}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border border-slate-800 bg-slate-950/95 shadow-sm shadow-slate-950/20">
                    <CardContent className="pt-6 text-center">
                        <p className="text-sm text-slate-400 mb-1">Correct Answers</p>
                        <p className="text-3xl font-bold text-emerald-300">{result.correct_answers}</p>
                    </CardContent>
                </Card>
                <Card className="border border-slate-800 bg-slate-950/95 shadow-sm shadow-slate-950/20">
                    <CardContent className="pt-6 text-center">
                        <p className="text-sm text-slate-400 mb-1">Wrong Answers</p>
                        <p className="text-3xl font-bold text-rose-300">{result.wrong_answers}</p>
                    </CardContent>
                </Card>
                <Card className="border border-slate-800 bg-slate-950/95 shadow-sm shadow-slate-950/20">
                    <CardContent className="pt-6 text-center">
                        <p className="text-sm text-slate-400 mb-1">Skipped</p>
                        <p className="text-3xl font-bold text-slate-200">{result.unanswered}</p>
                    </CardContent>
                </Card>
                <Card className="border border-slate-800 bg-slate-950/95 shadow-sm shadow-slate-950/20">
                    <CardContent className="pt-6 text-center">
                        <p className="text-sm text-slate-400 mb-1">Total Questions</p>
                        <p className="text-3xl font-bold text-sky-300">{result.total_questions}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border border-slate-800 bg-slate-950/95 shadow-2xl shadow-slate-950/40">
                <CardHeader className="bg-slate-900/80 border-b border-slate-800">
                    <CardTitle className="flex justify-between items-center text-white">
                        Performance Breakdown
                        <span className="text-sm font-normal text-slate-400">Accuracy: {accuracy.toFixed(1)}%</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-6">
                        <div className="bg-sky-500 h-full transition-all duration-500" style={{ width: `${accuracy}%` }}></div>
                    </div>

                    {result.review_data && result.review_data.length > 0 && (
                        <div className="space-y-6 mt-8">
                            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">Question Analysis</h3>
                            {result.review_data.map((item, index) => (
                                <div key={item.id} className={`p-6 rounded-2xl border ${item.is_correct ? 'bg-emerald-500/10 border-emerald-500/20' : item.user_answer ? 'bg-rose-500/10 border-rose-500/20' : 'bg-slate-900/80 border-slate-800'}`}>
                                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-4">
                                        <h4 className="font-medium text-white leading-relaxed">
                                            {index + 1}. {item.question_text}
                                        </h4>
                                        {item.is_correct ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 whitespace-nowrap bg-emerald-500/10 px-2 py-1 rounded-full">
                                                <CheckCircle className="w-3 h-3" /> CORRECT
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-300 whitespace-nowrap bg-rose-500/10 px-2 py-1 rounded-full">
                                                <XCircle className="w-3 h-3" /> {item.user_answer ? 'WRONG' : 'SKIPPED'}
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-slate-200">
                                        <div>
                                            <p className="text-sm text-slate-400 mb-1">Your Answer:</p>
                                            <p className={`font-medium ${item.is_correct ? 'text-emerald-300' : 'text-rose-300'}`}>
                                                {item.user_answer !== null
                                                    ? item.options.find(o => o.id === item.user_answer)?.text || 'Unknown'
                                                    : <span className="text-slate-500 italic">No answer provided</span>
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-400 mb-1">Correct Answer:</p>
                                            <p className="font-medium text-emerald-300">
                                                {item.options.find(o => o.id === item.correct_answer)?.text}
                                            </p>
                                        </div>
                                    </div>

                                    {item.explanation && (
                                        <div className="bg-slate-900/80 p-4 rounded-2xl border border-dashed border-slate-800 text-sm text-slate-300">
                                            <span className="font-bold text-slate-100 block mb-1 flex items-center gap-2">
                                                <BarChart2 className="w-4 h-4" /> Explanation:
                                            </span>
                                            <p className="leading-relaxed">
                                                {item.explanation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
