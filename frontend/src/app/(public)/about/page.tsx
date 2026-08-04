import { Shield, Target, Award, Users, Zap, Brain, Trophy, Star } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-24 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6 text-blue-300 text-sm font-medium">
                        <Shield className="w-3.5 h-3.5" />
                        About Us
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
                        About{' '}
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            Bravo Academy
                        </span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        We are dedicated to shaping the future leaders of Bangladesh through comprehensive IQ preparation and expert guidance.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                        {[
                            {
                                icon: Target,
                                gradient: 'from-blue-500 to-cyan-500',
                                bg: 'bg-blue-50',
                                iconColor: 'text-blue-600',
                                title: 'Our Mission',
                                desc: 'To provide the highest quality IQ training and coaching for aspirants, enabling them to realize their dreams of serving with honor and distinction. We prioritize integrity, excellence, and discipline in all our endeavors.',
                                border: 'border-blue-100',
                                hover: 'hover:border-blue-300',
                            },
                            {
                                icon: Shield,
                                gradient: 'from-purple-500 to-pink-500',
                                bg: 'bg-purple-50',
                                iconColor: 'text-purple-600',
                                title: 'Our Vision',
                                desc: 'To be the premier coaching institution in the country, recognized for our exceptional success rate, innovative teaching methodologies, and commitment to holistic development of defense aspirants.',
                                border: 'border-purple-100',
                                hover: 'hover:border-purple-300',
                            },
                        ].map((item) => (
                            <div key={item.title} className={`group relative bg-white rounded-2xl p-8 border-2 ${item.border} ${item.hover} shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden`}>
                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.gradient}`} />
                                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h2>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                        {[
                            { icon: Users, value: '500+', label: 'Students Trained', color: 'text-blue-600', bg: 'bg-blue-50' },
                            { icon: Trophy, value: '95%', label: 'Pass Rate', color: 'text-yellow-600', bg: 'bg-yellow-50' },
                            { icon: Brain, value: '1500+', label: 'Questions Bank', color: 'text-purple-600', bg: 'bg-purple-50' },
                            { icon: Star, value: '4.9/5', label: 'Student Rating', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div className={`text-3xl font-extrabold ${stat.color} mb-1`}>{stat.value}</div>
                                <div className="text-gray-500 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Values */}
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-4 border border-blue-100">Our Values</span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Stand For</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: Shield, title: 'Integrity', desc: 'We maintain the highest standards of honesty and transparency in everything we do, from our teaching methods to our platform security.', gradient: 'from-blue-500 to-cyan-500' },
                            { icon: Zap, title: 'Excellence', desc: 'We are committed to providing world-class preparation materials and coaching that consistently deliver outstanding results for our students.', gradient: 'from-purple-500 to-pink-500' },
                            { icon: Award, title: 'Discipline', desc: 'We instill the military discipline and rigor required for success in defense examinations through our structured, timed practice approach.', gradient: 'from-orange-500 to-red-500' },
                        ].map((val) => (
                            <div key={val.title} className="group relative overflow-hidden bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${val.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                <div className={`w-12 h-12 bg-gradient-to-br ${val.gradient} rounded-xl flex items-center justify-center mb-5`}>
                                    <val.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{val.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-extrabold text-white mb-4">Ready to Start Your Journey?</h2>
                    <p className="text-slate-300 text-lg mb-8">Join hundreds of successful defense candidates who trained with Bravo Academy.</p>
                    <a href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-xl shadow-blue-900/40 transition-all duration-300 hover:scale-105">
                        <Zap className="w-5 h-5" />
                        Get Started Today
                    </a>
                </div>
            </section>
        </div>
    )
}
