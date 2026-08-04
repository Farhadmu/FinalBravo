import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Smartphone, Shield, CheckCircle, ArrowRight, Zap } from "lucide-react"

export default function RegisterPage() {
    const steps = [
        {
            num: '01',
            title: 'Make Payment',
            color: 'from-blue-500 to-cyan-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            content: (
                <div>
                    <p className="text-slate-400 text-sm mb-3">
                        Send <span className="font-bold text-white">1000 BDT</span> to our official bKash number:
                    </p>
                    <div className="inline-flex items-center gap-3 bg-pink-500/10 border border-pink-500/20 rounded-xl px-4 py-3">
                        <div>
                            <p className="font-mono text-xl font-bold text-pink-300">01979-486096</p>
                            <p className="text-xs text-pink-400/70 mt-0.5">bKash Personal</p>
                        </div>
                        <span className="px-2 py-0.5 bg-pink-500/20 text-pink-300 text-xs rounded-full font-semibold">Personal</span>
                    </div>
                </div>
            )
        },
        {
            num: '02',
            title: 'Take a Screenshot',
            color: 'from-purple-500 to-pink-500',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20',
            content: (
                <p className="text-slate-400 text-sm">
                    After successful payment, take a clear screenshot of the bKash transaction confirmation screen.
                </p>
            )
        },
        {
            num: '03',
            title: 'Send via WhatsApp',
            color: 'from-green-500 to-emerald-500',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20',
            content: (
                <div>
                    <p className="text-slate-400 text-sm mb-4">
                        Send the screenshot along with your <span className="text-white font-semibold">Full Name</span> to our WhatsApp:
                    </p>
                    <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white border-0 shadow-lg shadow-green-900/30 h-11">
                        <a href="https://wa.me/8801979486096" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4" />
                            Chat on WhatsApp
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </Button>
                </div>
            )
        },
        {
            num: '04',
            title: 'Get Your Credentials',
            color: 'from-orange-500 to-yellow-500',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/20',
            content: (
                <p className="text-slate-400 text-sm">
                    Our admin will verify your payment and send your unique <span className="text-white font-semibold">Username</span> and <span className="text-white font-semibold">Password</span> on WhatsApp within <span className="text-orange-300 font-semibold">30 minutes</span>.
                </p>
            )
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="relative z-10 max-w-3xl mx-auto px-4 py-16 sm:px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-900/50">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 mb-4 text-blue-300 text-sm font-medium">
                        <Zap className="w-3.5 h-3.5 text-yellow-400" />
                        Premium Program Enrollment
                    </div>
                    <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
                        Join Bravo Academy
                    </h1>
                    <p className="text-slate-400 text-lg max-w-lg mx-auto">
                        Follow these simple steps to get your premium access credentials and start your defense IQ preparation.
                    </p>
                </div>

                {/* Info banner */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 mb-8 flex gap-4 backdrop-blur-sm">
                    <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-blue-300 mb-1">Manual Verification Process</p>
                        <p className="text-slate-400 text-sm">
                            For security and premium quality control, we manually verify all students. Complete the payment and send verification to receive your access.
                        </p>
                    </div>
                </div>

                {/* Steps */}
                <div className="space-y-4 mb-10">
                    {steps.map((step, idx) => (
                        <div
                            key={idx}
                            className={`relative bg-white/5 backdrop-blur-sm border ${step.border} rounded-2xl p-6 overflow-hidden group hover:bg-white/8 transition-all duration-300`}
                        >
                            {/* Step connector line */}
                            {idx < steps.length - 1 && (
                                <div className="absolute left-11 -bottom-4 w-0.5 h-4 bg-gradient-to-b from-slate-600 to-transparent z-10" />
                            )}

                            <div className="flex gap-5">
                                {/* Step number */}
                                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center font-bold text-white text-sm shadow-lg`}>
                                    {step.num}
                                </div>

                                <div className="flex-1 pt-1">
                                    <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
                                    {step.content}
                                </div>

                                <CheckCircle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-1 group-hover:text-green-500 transition-colors duration-300" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Already have account */}
                <div className="text-center bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <p className="text-slate-400 mb-4">Already received your credentials?</p>
                    <Link href="/login">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-blue-900/30 h-11 px-8">
                            <Zap className="w-4 h-4 mr-2" />
                            Login to Dashboard
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
