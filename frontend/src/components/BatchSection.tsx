'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Tag, ArrowRight, Clock, CheckCircle, Zap, Users, X } from 'lucide-react';

interface Batch {
    id: number;
    name: string;
    description: string;
    price: string;
    start_date: string;
    end_date: string | null;
    status: 'upcoming' | 'running' | 'completed';
    is_active: boolean;
    image?: string | null;
}

const STATUS_CONFIG = {
    upcoming: {
        label: 'Upcoming',
        gradient: 'from-yellow-500 to-orange-500',
        bg: 'bg-yellow-50',
        color: 'text-yellow-700',
        border: 'border-yellow-200',
        icon: Clock,
        pulse: true,
    },
    running: {
        label: 'Now Running',
        gradient: 'from-green-500 to-emerald-500',
        bg: 'bg-green-50',
        color: 'text-green-700',
        border: 'border-green-200',
        icon: CheckCircle,
        pulse: true,
    },
    completed: {
        label: 'Completed',
        gradient: 'from-gray-400 to-gray-500',
        bg: 'bg-gray-50',
        color: 'text-gray-500',
        border: 'border-gray-200',
        icon: CheckCircle,
        pulse: false,
    },
};

export default function BatchSection() {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

    const selectedStatus = selectedBatch ? STATUS_CONFIG[selectedBatch.status] : null;
    const SelectedStatusIcon = selectedStatus?.icon;

    const getImageUrl = (image?: string | null) => {
        if (!image) return null;
        if (image.startsWith('http')) return image;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') || '';
        if (image.startsWith('/')) return `${baseUrl}${image}`;
        return `${baseUrl}/${image}`;
    };

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/batches/batches/`)
            .then(res => res.json())
            .then(data => {
                const list = data.results || data;
                setBatches(Array.isArray(list) ? list.filter((b: Batch) => b.is_active) : []);
            })
            .catch(() => setBatches([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading || batches.length === 0) return null;

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1 bg-green-50 text-green-600 rounded-full text-sm font-semibold mb-4 border border-green-100">
                        Coaching Batches
                    </span>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Join Our
                        <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Running Batches</span>
                    </h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Enroll in our structured coaching program and prepare with expert guidance alongside fellow candidates.
                    </p>
                </div>

                {/* Batch cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {batches.map((batch) => {
                        const config = STATUS_CONFIG[batch.status];
                        const isCompleted = batch.status === 'completed';
                        const imageUrl = getImageUrl(batch.image);

                        return (
                            <div
                                key={batch.id}
                                onClick={() => setSelectedBatch(batch)}
                                className={`group cursor-pointer overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-xl transition-all duration-300 ${isCompleted ? 'opacity-70' : ''}`}
                            >
                                <div className="relative h-64 overflow-hidden">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={batch.name}
                                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className={`h-full w-full ${config.bg}`} />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4 text-white">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-black/40 backdrop-blur-sm">
                                            <config.icon className="w-3 h-3" />
                                            {config.label}
                                        </div>
                                        <h3 className="mt-3 text-2xl font-semibold leading-tight">{batch.name}</h3>
                                    </div>
                                </div>

                                <div className="p-5 flex-1 flex flex-col">
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
                                        {batch.description}
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Tag className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">Course Fee</p>
                                                <p className="font-bold text-blue-600 text-lg">৳{batch.price} BDT</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Calendar className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">Start Date</p>
                                                <p className="font-semibold text-gray-800 text-sm">
                                                    {new Date(batch.start_date).toLocaleDateString('en-BD', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        {batch.end_date && (
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Calendar className="w-4 h-4 text-orange-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400">End Date</p>
                                                    <p className="font-semibold text-gray-800 text-sm">
                                                        {new Date(batch.end_date).toLocaleDateString('en-BD', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {!isCompleted ? (
                                        <Link href="/register" className="mt-auto">
                                            <Button className={`w-full gap-2 bg-gradient-to-r ${config.gradient} hover:opacity-90 text-white border-0 shadow-md transition-all duration-200 group-hover:shadow-lg`}>
                                                <Zap className="w-4 h-4" />
                                                Enroll Now — ৳{batch.price}
                                                <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button disabled className="w-full bg-gray-100 text-gray-400 border-0 cursor-not-allowed mt-auto">
                                            Batch Completed
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {selectedBatch && (
                    <div className="fixed inset-x-0 top-0 z-50 flex justify-center bg-slate-950/70 p-4 pt-10">
                        <div className="relative w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-2xl border border-slate-200 max-h-[92vh]">
                            <button
                                onClick={() => setSelectedBatch(null)}
                                className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:bg-slate-100"
                                aria-label="Close batch details"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="overflow-hidden bg-slate-100">
                                {getImageUrl(selectedBatch.image) ? (
                                    <img
                                        src={getImageUrl(selectedBatch.image) || ''}
                                        alt={selectedBatch.name}
                                        className="w-full max-h-[480px] object-contain"
                                    />
                                ) : (
                                    <div className={`h-80 w-full ${STATUS_CONFIG[selectedBatch.status].bg}`} />
                                )}
                            </div>

                            <div className="space-y-6 p-8">
                                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="max-w-3xl">
                                        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                                            {SelectedStatusIcon && <SelectedStatusIcon className="h-3.5 w-3.5" />}
                                            {selectedStatus?.label}
                                        </div>
                                        <h3 className="mt-4 text-3xl font-semibold text-slate-900">{selectedBatch.name}</h3>
                                        <p className="mt-4 text-slate-600 leading-relaxed">{selectedBatch.description}</p>
                                    </div>

                                    <div className="flex shrink-0 flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-slate-500">
                                                <span>Course Fee</span>
                                                <span className="font-semibold text-slate-900">৳{selectedBatch.price} BDT</span>
                                            </div>
                                            <div className="flex items-center justify-between text-slate-500">
                                                <span>Start Date</span>
                                                <span className="font-semibold text-slate-900">{new Date(selectedBatch.start_date).toLocaleDateString('en-BD', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}</span>
                                            </div>
                                            {selectedBatch.end_date && (
                                                <div className="flex items-center justify-between text-slate-500">
                                                    <span>End Date</span>
                                                    <span className="font-semibold text-slate-900">{new Date(selectedBatch.end_date).toLocaleDateString('en-BD', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}</span>
                                                </div>
                                            )}
                                        </div>
                                        <Link
                                            href="/register"
                                            className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-r ${STATUS_CONFIG[selectedBatch.status].gradient} px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95`}
                                        >
                                            <Zap className="mr-2 h-4 w-4" />
                                            Enroll Now — ৳{selectedBatch.price}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom note */}
                <div className="text-center mt-10">
                    <p className="text-gray-500 text-sm">
                        <Users className="w-4 h-4 inline mr-1" />
                        All batches include full access to our online IQ test platform.
                        <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
                            Contact us for more info →
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}
