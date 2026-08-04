'use client';

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthStore } from '@/store/auth'
import api from '@/lib/api'
import { Shield, AlertCircle, Eye, EyeOff, Zap, Lock, User } from "lucide-react"
import { toast } from 'sonner'

const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof loginSchema>

export default function LoginPage() {
    const router = useRouter()
    const login = useAuthStore((state) => state.login)
    const { user, isAuthenticated } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [slowLoadId, setSlowLoadId] = useState<string | number | null>(null)
    const [maintenance, setMaintenance] = useState<{ is_active: boolean; message: string } | null>(null)

    useEffect(() => {
        setMounted(true)
        api.get('/system/maintenance/current/')
            .then(res => setMaintenance(res.data))
            .catch(() => { })
    }, [])

    useEffect(() => {
        if (mounted && isAuthenticated && user) {
            if (user.role === 'developer') router.push('/developer')
            else if (user.role === 'admin') router.push('/admin/dashboard')
            else router.push('/dashboard')
        }
    }, [mounted, isAuthenticated, user, router])

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: FormData) => {
        if (!navigator.onLine) {
            toast.error('No internet connection.', { description: 'Please check your network.' })
            return
        }
        setIsLoading(true)
        try {
            const response = await api.post('/auth/login/', {
                username: data.username,
                password: data.password,
            })
            const { user } = response.data
            if (slowLoadId) toast.dismiss(slowLoadId)
            login(user)
            toast.success('Logged in successfully!')
            if (user.role === 'developer') router.push('/developer')
            else if (user.role === 'admin') router.push('/admin/dashboard')
            else router.push('/dashboard')
        } catch (err: any) {
            if (slowLoadId) toast.dismiss(slowLoadId)
            let message = 'Login failed'
            let description = 'Please check your username and password.'
            if (err.response?.status === 503) {
                message = 'Maintenance Mode'
                description = err.response.data.message || 'System is under maintenance.'
            } else if (err.response?.status === 403) {
                message = 'Device Lock Active'
                description = err.response.data.error || 'This ID is logged in on another device.'
            } else if (err.response?.status === 401) {
                message = 'Invalid Credentials'
                description = 'The username or password is incorrect.'
            } else if (!err.response) {
                message = 'Network Error'
                description = 'Could not reach the server.'
            }
            toast.error(message, { description, duration: 8000 })
        } finally {
            setIsLoading(false)
        }
    }

    if (!mounted || isAuthenticated) return null

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 relative overflow-hidden">
            {/* Animated background blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Left panel - branding */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative z-10">
                <div className="max-w-md text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-900/50">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
                        Bravo Academy
                    </h1>
                    <p className="text-blue-200 text-lg leading-relaxed mb-8">
                        Bangladesh's premier defense IQ preparation platform. Train harder, score higher.
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                        {[['1500+', 'Questions'], ['95%', 'Pass Rate'], ['500+', 'Students']].map(([val, label]) => (
                            <div key={label} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                                <div className="text-2xl font-bold text-white">{val}</div>
                                <div className="text-blue-300 text-xs mt-1">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right panel - form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-md">
                    {maintenance?.is_active && (
                        <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex gap-3 backdrop-blur-sm">
                            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-yellow-300 mb-1">System Maintenance</p>
                                <p className="text-xs text-yellow-400/80">{maintenance.message}</p>
                            </div>
                        </div>
                    )}

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-900/50 lg:hidden">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                            <p className="text-slate-400 mt-1 text-sm">Enter your credentials to continue</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Username */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-300">Username</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        type="text"
                                        {...register('username')}
                                        placeholder="Enter your username"
                                        className={`pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 ${errors.username ? 'border-red-500/50' : ''}`}
                                    />
                                </div>
                                {errors.username && <p className="text-red-400 text-xs">{errors.username.message}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-300">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password')}
                                        placeholder="Enter your password"
                                        className={`pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 ${errors.password ? 'border-red-500/50' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-blue-900/30 transition-all duration-300"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Connecting...</span>
                                ) : (
                                    <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Login to Dashboard</span>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center space-y-3">
                            <p className="text-sm text-slate-400">
                                Don't have an account?{' '}
                                <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                                    Register Now
                                </Link>
                            </p>
                            <p className="text-xs text-slate-600">
                                You are only allowed to login from one designated device.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
