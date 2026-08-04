'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import {
    LayoutDashboard,
    Brain,
    History,
    User,
    LogOut,
    Menu,
    X,
    Settings,
    Users,
    HelpCircle,
    Moon,
    SunMoon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [redirectChecked, setRedirectChecked] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const savedTheme = typeof window !== 'undefined' ? window.localStorage.getItem('theme') : null;
        const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme === 'dark' || (!savedTheme && prefersDark) ? 'dark' : 'light';
        setTheme(initialTheme);
        if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', initialTheme === 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        if (typeof window !== 'undefined') window.localStorage.setItem('theme', nextTheme);
        if (typeof document !== 'undefined') document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    };

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const heartbeat = setInterval(async () => {
            try { await api.get('/health/'); } catch (err) { }
        }, 60000);

        return () => clearInterval(heartbeat);
    }, [isAuthenticated, router]);

    // Role-based redirect via useEffect
    useEffect(() => {
        if (!mounted || !isAuthenticated || !user) return;

        const role = user.role;

        if (role === 'student') {
            if (pathname.startsWith('/admin') || pathname.startsWith('/developer')) {
                router.replace('/dashboard');
                return;
            }
        }

        if (role === 'admin') {
            if (pathname === '/dashboard') {
                router.replace('/admin/dashboard');
                return;
            }
            if (pathname.startsWith('/developer')) {
                router.replace('/admin/dashboard');
                return;
            }
        }

        setRedirectChecked(true);
    }, [mounted, isAuthenticated, user, pathname, router]);

    if (!mounted || !isAuthenticated) return null;
    if (!redirectChecked) return null;

    const sidebarLinks = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/tests?category=verbal', label: 'Verbal IQ', icon: Brain },
        { href: '/dashboard/tests?category=non-verbal', label: 'Non-Verbal IQ', icon: Brain },
        { href: '/dashboard/tests?category=wat', label: 'Word Association (WAT)', icon: Brain },
        { href: '/dashboard/results', label: 'My Results', icon: History },
        { href: '/dashboard/profile', label: 'Profile', icon: User },
    ];

    const adminLinks = [
        { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/admin/users', label: 'User Management', icon: User },
        { href: '/admin/tests', label: 'Test Management', icon: Brain },
        { href: '/admin/questions', label: 'Question Management', icon: HelpCircle },
        { href: '/admin/batches', label: 'Batch Management', icon: Users },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
    ];

    const isAdminPath = pathname.startsWith('/admin');
    const links = (user?.role === 'admin' || user?.role === 'developer') && isAdminPath
        ? adminLinks
        : sidebarLinks;

    return (
        <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${isAdminPath ? 'bg-slate-950 text-slate-100' : 'bg-gray-100 text-slate-900'}`}>
            {/* Mobile Header */}
            <div className={`md:hidden fixed top-0 left-0 right-0 h-16 z-30 flex items-center justify-between px-4 ${isAdminPath ? 'bg-slate-950/95 border-b border-slate-800 text-slate-100' : 'bg-white border-b border-gray-200 text-slate-900'} backdrop-blur-xl`}>
                <Link href="/" className="flex items-center gap-3">
                    <img src="/images/logo.jpg" alt="Bravo Academy" className="h-8 w-8 rounded-md object-cover shadow-sm" />
                    <span className={`font-bold text-lg ${isAdminPath ? 'text-white' : 'text-slate-900'}`}>Bravo Academy</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-slate-200 hover:text-white">
                        {theme === 'dark' ? <SunMoon className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X className="h-6 w-6 text-slate-100" /> : <Menu className="h-6 w-6 text-slate-100" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/60 md:hidden animate-in fade-in duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                    <div
                        className={`fixed inset-y-0 left-0 w-3/4 max-w-xs flex flex-col animate-in slide-in-from-left duration-200 ${isAdminPath ? 'bg-slate-950 text-slate-100 shadow-2xl' : 'bg-white shadow-xl'}`}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className={`h-16 flex items-center px-6 border-b ${isAdminPath ? 'border-slate-800' : 'border-gray-200'}`}>
                            <span className={`font-bold text-lg ${isAdminPath ? 'text-white' : 'text-gray-900'}`}>Menu</span>
                        </div>
                        <div className="p-4 flex-grow overflow-y-auto">
                            <div className="space-y-1">
                                {links.map((link) => (
                                    <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant={pathname === link.href ? 'secondary' : 'ghost'} className="w-full justify-start gap-3 mb-1">
                                            <link.icon className="h-5 w-5" />
                                            {link.label}
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className={`p-4 border-t ${isAdminPath ? 'border-slate-800' : 'border-gray-200'}`}>
                            <div className="flex items-center gap-3 mb-4 px-2">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${isAdminPath ? 'bg-slate-800 text-slate-100' : 'bg-blue-100 text-blue-700'}`}>
                                    {user?.username?.charAt(0).toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <p className={`text-sm font-medium truncate ${isAdminPath ? 'text-slate-100' : 'text-gray-900'}`}>{user?.username}</p>
                                    <p className={`text-xs capitalize ${isAdminPath ? 'text-slate-400' : 'text-gray-500'}`}>{user?.role}</p>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full justify-start gap-3"
                                onClick={() => { setIsMobileMenuOpen(false); logout(); router.push('/login'); }}>
                                <LogOut className="h-5 w-5" /> Logout
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className={`w-64 hidden md:flex flex-col fixed h-full z-20 transition-all duration-300 ${isAdminPath ? 'bg-slate-950 border-r border-slate-800 text-slate-100 shadow-2xl' : 'bg-white border-r border-gray-200 text-slate-900 shadow-lg'}`}>
                <div className={`h-16 flex items-center px-6 border-b ${isAdminPath ? 'border-slate-800 bg-slate-950/90' : 'border-gray-200 bg-white'}`}>
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/images/logo.jpg" alt="Bravo Academy" className="h-10 w-10 rounded-lg object-cover shadow-sm" />
                        <div>
                            <p className={`font-bold text-xl ${isAdminPath ? 'text-white' : 'text-slate-900'}`}>Bravo Academy</p>
                            {isAdminPath && <p className="text-xs text-slate-400">Admin Portal</p>}
                        </div>
                    </Link>
                </div>

                <div className="p-4 flex-grow overflow-y-auto">
                    <div className="space-y-2">
                        {links.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link key={link.href} href={link.href}>
                                    <Button
                                        variant={isActive ? 'secondary' : 'ghost'}
                                        className={`w-full justify-start gap-3 mb-1 text-left transition-all duration-200 ${isActive
                                            ? (isAdminPath ? 'shadow-lg bg-slate-900 text-white' : 'shadow-lg bg-slate-100 text-slate-900')
                                            : isAdminPath ? 'hover:bg-slate-800/80 text-slate-200' : 'hover:bg-slate-50'
                                        }`}
                                    >
                                        <link.icon className="h-5 w-5" />
                                        {link.label}
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className={`p-4 ${isAdminPath ? 'border-t border-slate-800' : 'border-t border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${isAdminPath ? 'bg-slate-800 text-slate-100' : 'bg-blue-100 text-blue-700'}`}>
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className={`text-sm font-medium truncate ${isAdminPath ? 'text-slate-100' : 'text-gray-900'}`}>{user?.username}</p>
                            <p className={`text-xs capitalize ${isAdminPath ? 'text-slate-400' : 'text-gray-500'}`}>{user?.role}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                        <Button variant="ghost" size="icon" onClick={toggleTheme}
                            className={`${isAdminPath ? 'text-slate-200 hover:text-white' : 'text-gray-600 hover:text-slate-900'}`}>
                            {theme === 'dark' ? <SunMoon className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>
                        <Button variant="outline"
                            className={`w-full justify-start gap-3 ${isAdminPath ? 'border-slate-700 text-slate-200 hover:bg-slate-900/80' : ''}`}
                            onClick={() => { logout(); router.push('/login'); }}>
                            <LogOut className="h-5 w-5" /> Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 md:ml-64 p-4 md:p-8 pt-24 md:pt-12 transition-colors duration-300 ${isAdminPath ? 'bg-slate-950 text-slate-100' : 'bg-gray-100 text-slate-900'}`}>
                <div className="max-w-full mx-auto animate-in fade-in duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
