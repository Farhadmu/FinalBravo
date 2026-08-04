'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Phone, Send, MessageCircle, Clock, Zap, Mail } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-20 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6 text-blue-300 text-sm font-medium">
                        <MessageCircle className="w-3.5 h-3.5" />
                        Contact Us
                    </div>
                    <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
                        Get in{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Touch</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Have questions? We're here to help you on your defense preparation journey.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

                        {/* Contact Form */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                                <p className="text-gray-500 mb-8">Fill out the form and we'll get back to you shortly.</p>

                                <form className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                                            <Input placeholder="John Doe" className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-700">Email</label>
                                            <Input type="email" placeholder="john@example.com" className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-700">Subject</label>
                                        <Input placeholder="Course Inquiry" className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-700">Message</label>
                                        <textarea
                                            rows={5}
                                            placeholder="How can we help you?"
                                            className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-colors resize-none"
                                        />
                                    </div>
                                    <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-blue-900/20 transition-all duration-300 text-base">
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Message
                                    </Button>
                                </form>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* WhatsApp */}
                            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                                    <Phone className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-lg mb-1">WhatsApp & Phone</h3>
                                <p className="text-green-100 font-mono text-xl font-bold mb-1">01979-486096</p>
                                <p className="text-green-200 text-sm mb-4">Fastest way to reach us</p>
                                <Button asChild className="w-full bg-white text-green-700 hover:bg-green-50 border-0 font-semibold h-11">
                                    <a href="https://wa.me/8801979486096" target="_blank" rel="noopener noreferrer">
                                        Message on WhatsApp
                                    </a>
                                </Button>
                            </div>

                            {/* Office Hours */}
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">Office Hours</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    We are available on WhatsApp and Phone from <span className="font-semibold text-blue-600">9:00 AM</span> to <span className="font-semibold text-blue-600">9:00 PM</span> every day of the week.
                                </p>
                            </div>

                            {/* Quick response */}
                            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                                    <Zap className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">Quick Response</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    After payment verification, your credentials are sent within <span className="font-semibold text-purple-600">30 minutes</span> via WhatsApp.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
