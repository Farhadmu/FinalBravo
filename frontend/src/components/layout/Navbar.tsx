'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path: string) => pathname === path;

    const publicLinks = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/leadership', label: 'Leadership' },
        { href: '/contact', label: 'Contact' },
        { href: '/sample-test', label: 'Free Sample Test' },
    ];

    const dashboardLinks = [
        { href: user?.role === 'admin' ? '/admin/dashboard' : '/dashboard', label: 'Overview' },
        { href: user?.role === 'admin' ? '/admin/tests' : '/dashboard/tests', label: user?.role === 'admin' ? 'Tests' : 'Take IQ Test' },
        { href: user?.role === 'admin' ? '/admin/users' : '/dashboard/results', label: user?.role === 'admin' ? 'Users' : 'My Results' },
        { href: user?.role === 'admin' ? '/admin/settings' : '/dashboard/profile', label: user?.role === 'admin' ? 'Settings' : 'Profile' },
    ];

    const isPortal = pathname.startsWith('/admin') || pathname.startsWith('/dashboard');
    if (isPortal) return null;

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-slate-900/95 backdrop-blur-md shadow-lg shadow-black/20'
                    : 'bg-slate-900'
            }`}
        >
            {/* Top accent line */}
            <div className="h-0.5 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <img
                                    src="/images/logo.jpg"
                                    alt="Bravo Academy"
                                    className="h-9 w-9 rounded-lg object-cover shadow-md ring-2 ring-blue-500/30 group-hover:ring-blue-400/60 transition-all duration-300"
                                />
                                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg text-white leading-tight tracking-tight">
                                    Bravo Academy
                                </span>
                                <span className="text-xs text-blue-400 leading-tight font-medium">
                                    Defense IQ Prep
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1">
                        {publicLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                                    isActive(link.href)
                                        ? 'text-blue-400'
                                        : 'text-slate-300 hover:text-white'
                                }`}
                            >
                                {link.label}
                                <span
                                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ${
                                        isActive(link.href) ? 'w-4/5' : 'w-0 group-hover:w-4/5'
                                    }`}
                                />
                            </Link>
                        ))}

                        <div className="ml-4 pl-4 border-l border-slate-700 flex items-center gap-2">
                            {isAuthenticated ? (
                                <>
                                    <Link href={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                                        >
                                            <User className="h-4 w-4" />
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => logout()}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-950/30 flex items-center gap-2"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-slate-300 hover:text-white hover:bg-slate-800"
                                        >
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button
                                            size="sm"
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-md shadow-blue-900/30 transition-all duration-200"
                                        >
                                            <Zap className="h-3.5 w-3.5 mr-1.5" />
                                            Get Started
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-slate-900 border-t border-slate-800">
                    <div className="px-4 py-3 space-y-1">
                        {publicLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    isActive(link.href)
                                        ? 'bg-blue-900/40 text-blue-400'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="pt-3 mt-3 border-t border-slate-800 flex flex-col gap-2">
                            {isAuthenticated ? (
                                <>
                                    <Link href={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="ghost" size="sm" className="w-full text-slate-300 hover:text-white hover:bg-slate-800">
                                            <User className="h-4 w-4 mr-2" /> Dashboard
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => { logout(); setIsMenuOpen(false); }}
                                        className="w-full text-red-400 hover:text-red-300 hover:bg-red-950/30"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" /> Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="ghost" size="sm" className="w-full text-slate-300 hover:text-white hover:bg-slate-800">Login</Button>
                                    </Link>
                                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                                        <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0">
                                            <Zap className="h-3.5 w-3.5 mr-1.5" /> Get Started
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
