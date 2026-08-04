'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, Brain, Trophy, Users, Star, ArrowRight, Zap, Shield, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import BatchSection from '@/components/BatchSection';

const galleryImages = [
    '/gallery/gallery-1.jpg.jpeg',
    '/gallery/gallery-2.jpg.jpeg',
    '/gallery/gallery-3.jpg.jpeg',
    '/gallery/gallery-4.jpg.jpeg',
    '/gallery/gallery-5.jpg.jpeg',
    '/gallery/gallery-6.jpg.jpeg',
    '/gallery/gallery-7.jpg.jpeg',
    '/gallery/gallery-8.jpg.jpeg',
    '/gallery/gallery-9.jpg.jpeg',
    '/gallery/gallery-10.jpg.jpeg',
    '/gallery/gallery-11.jpg.jpeg',
    '/gallery/gallery-12.jpg.jpeg',
];

function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const [prev, setPrev] = useState(galleryImages.length - 1);
    const [transitioning, setTransitioning] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setTransitioning(true);
            setTimeout(() => {
                setPrev(current);
                setCurrent((c) => (c + 1) % galleryImages.length);
                setTransitioning(false);
            }, 800);
        }, 2000);
        return () => clearInterval(interval);
    }, [current]);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {galleryImages.map((img, idx) => (
                <div
                    key={img}
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
                    style={{
                        backgroundImage: `url(${img})`,
                        opacity: idx === current ? 1 : 0,
                        zIndex: idx === current ? 1 : 0,
                    }}
                />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90 z-10" />
            <div className="absolute inset-0 z-10 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.4) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000 z-10" />

            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-32">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 mb-8 text-blue-300 text-sm font-medium backdrop-blur-sm">
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    Bangladesh's #1 Defense IQ Prep Platform
                    <span className="flex w-2 h-2 bg-green-400 rounded-full animate-ping" />
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
                    Master Your{' '}
                    <span className="relative">
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Defense IQ</span>
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-full" />
                    </span>
                    <br />
                    <span className="text-white">Test Preparation</span>
                </h1>

                <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                    Professional coaching platform designed to help you excel in
                    <span className="text-blue-300 font-semibold"> ISSB & recruitment exams</span>.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                    <Link href="/register">
                        <Button size="lg" className="w-full sm:w-auto text-base px-8 h-13 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-xl shadow-blue-900/40 transition-all duration-300 hover:scale-105">
                            <Zap className="w-4 h-4 mr-2" /> Start Free Preparation <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                    <Link href="/sample-test">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 h-13 bg-white/5 text-white border-white/20 hover:bg-white/10 hover:border-white/40 backdrop-blur-sm transition-all duration-300">
                            Try Free Sample Test
                        </Button>
                    </Link>
                </div>

                <div className="flex justify-center gap-8 md:gap-16">
                    {[{ value: '1500+', label: 'Questions' }, { value: '500+', label: 'Students' }, { value: '95%', label: 'Success Rate' }].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">{stat.value}</div>
                            <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center gap-2 mt-10">
                    {galleryImages.map((_, idx) => (
                        <button key={idx} onClick={() => setCurrent(idx)} className={`transition-all duration-300 rounded-full ${idx === current ? 'w-6 h-2 bg-blue-400' : 'w-2 h-2 bg-white/30 hover:bg-white/50'}`} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen overflow-hidden">

            <HeroCarousel />

            {/* SUCCESS PHOTOS STRIP */}
            <section className="py-12 bg-slate-900 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4">
                    <p className="text-center text-slate-400 text-sm font-medium uppercase tracking-widest mb-6">Our Success Stories</p>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {galleryImages.map((img, idx) => (
                            <div key={idx} className="flex-shrink-0 w-32 h-40 rounded-xl overflow-hidden ring-2 ring-white/10 hover:ring-blue-500/50 transition-all duration-300 hover:scale-105">
                                <img src={img} alt={`Success story ${idx + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* RUNNING BATCHES */}
            <BatchSection />

            {/* FEATURES */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-4 border border-blue-100">Why Choose Us</span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Succeed</span></h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">Comprehensive preparation tools designed by defense exam experts</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Clock, bg: 'bg-blue-50', iconColor: 'text-blue-600', gradient: 'from-blue-500 to-cyan-500', title: 'Timed Practice Tests', desc: 'Simulate real exam conditions with strict timing. 30 minutes for 100 questions to build speed and accuracy under pressure.' },
                            { icon: Brain, bg: 'bg-purple-50', iconColor: 'text-purple-600', gradient: 'from-purple-500 to-pink-500', title: 'Expert Question Bank', desc: 'Thousands of curated questions covering all IQ patterns, logic puzzles, verbal and non-verbal reasoning topics.' },
                            { icon: CheckCircle, bg: 'bg-emerald-50', iconColor: 'text-emerald-600', gradient: 'from-emerald-500 to-teal-500', title: 'Detailed Analytics', desc: 'Track your progress with instant results, performance breakdowns, and personalized improvement suggestions.' },
                        ].map((feature) => (
                            <div key={feature.title} className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent hover:-translate-y-1 overflow-hidden">
                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TEST CATEGORIES */}
            <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-semibold mb-4 border border-purple-100">Test Categories</span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Three Paths to<span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Mastery</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: Target, bg: 'bg-gradient-to-br from-blue-600 to-cyan-600', title: 'Verbal IQ', desc: 'Analogies, synonyms, antonyms, and sentence completion exercises.', badge: 'Language & Logic' },
                            { icon: Brain, bg: 'bg-gradient-to-br from-purple-600 to-pink-600', title: 'Non-Verbal IQ', desc: 'Pattern recognition, spatial reasoning, and matrix completion.', badge: 'Visual Thinking' },
                            { icon: Zap, bg: 'bg-gradient-to-br from-orange-500 to-red-500', title: 'WAT', desc: 'Word Association Test to measure your subconscious thought patterns.', badge: 'Psychological' },
                        ].map((cat) => (
                            <div key={cat.title} className={`${cat.bg} rounded-2xl p-8 text-white relative overflow-hidden group hover:scale-105 transition-all duration-300 shadow-lg`}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                                <span className="relative inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-4">{cat.badge}</span>
                                <div className="relative w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <cat.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="relative text-2xl font-bold mb-3">{cat.title}</h3>
                                <p className="relative text-white/80 leading-relaxed">{cat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SOCIAL PROOF */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-50', value: '95%', label: 'Pass Rate', desc: 'Students who complete our full course pass their exams' },
                            { icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', value: '500+', label: 'Active Students', desc: 'Candidates currently preparing with our platform' },
                            { icon: Star, color: 'text-purple-500', bg: 'bg-purple-50', value: '4.9/5', label: 'Student Rating', desc: 'Average satisfaction rating from our community' },
                        ].map((item) => (
                            <div key={item.label} className="text-center p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                                <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                                    <item.icon className={`w-8 h-8 ${item.color}`} />
                                </div>
                                <div className="text-4xl font-extrabold text-gray-900 mb-1">{item.value}</div>
                                <div className="text-lg font-semibold text-gray-700 mb-2">{item.label}</div>
                                <p className="text-gray-500 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-12 md:p-16 text-center text-white overflow-hidden">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                        <div className="relative">
                            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6 text-blue-200 text-sm font-medium">
                                <Shield className="w-3.5 h-3.5" /> Trusted by Bangladesh Defense Aspirants
                            </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                                Ready to ace your<br />
                                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Intelligence Test?</span>
                            </h2>
                            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">Join hundreds of successful candidates. Start with a free sample test — no registration required.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/register">
                                    <Button size="lg" className="w-full sm:w-auto px-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white border-0 shadow-xl hover:scale-105 transition-all duration-300">
                                        <Zap className="w-4 h-4 mr-2" /> Get Premium Access <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                                <Link href="/sample-test">
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 bg-white/5 text-white border-white/20 hover:bg-white/10 hover:border-white/40">
                                        Try Free Sample First
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
