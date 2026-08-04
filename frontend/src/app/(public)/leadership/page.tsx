import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, Code, Server, BarChart, Zap } from 'lucide-react';

export default function LeadershipPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-5xl sm:tracking-tight lg:text-7xl">
                            Leadership & Technology
                        </h1>
                        <p className="mt-4 md:mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-500 leading-relaxed px-2">
                            Meet the leadership shaping Bravo Academy’s digital coaching platform, focused on delivering secure, modern learning tools for ISSB aspirants.
                        </p>
                    </div>
                </div>
            </div>

            {/* CEO Section */}
            <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-16 items-start">
                    <div className="w-full lg:col-span-5 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-slate-700 via-slate-900 to-slate-700 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl mx-auto max-w-md lg:max-w-none">
                            <Image
                                src="/images/leadership-ceo.jpg"
                                alt="Bravo Academy CEO"
                                fill
                                className="object-cover transition duration-500 group-hover:scale-105"
                                priority
                            />
                        </div>
                    </div>

                    <div className="w-full lg:col-span-7 mt-10 lg:mt-0">
                        <div className="space-y-6 md:space-y-8">
                            <div className="text-center lg:text-left">
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">MD. Tarequl Islam Rakib</h2>
                                <p className="text-blue-600 font-bold uppercase tracking-widest mt-2 text-sm md:text-base">
                                    Bravo Academy CEO — Website Leadership and Academy Vision
                                </p>
                            </div>

                            <div className="prose prose-slate text-slate-600 max-w-none space-y-4 md:space-y-6">
                                <p className="text-base md:text-lg leading-relaxed text-center lg:text-left">
                                    Bravo Academy’s leadership is committed to empowering students through an accessible, technology-first test preparation experience.
                                </p>
                                <p className="text-base md:text-lg leading-relaxed text-center lg:text-left">
                                    The website reflects a mission to combine coaching excellence with digital reliability, helping learners build confidence for defense selection tests.
                                </p>
                                <div className="bg-slate-100 p-6 rounded-xl border-l-4 border-slate-300">
                                    <p className="text-base md:text-lg leading-relaxed italic text-slate-700 m-0">
                                        The academy strives to build a secure online platform that supports every student’s growth and readiness for competitive exams.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                                <Link href="/about" className="w-full sm:w-auto">
                                    <Button variant="outline" className="w-full h-12 text-base">Learn About Academy</Button>
                                </Link>
                                <Link href="https://www.facebook.com/profile.php?id=61585694130139" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                                    <Button className="w-full flex items-center justify-center gap-2 h-12 text-base shadow-lg shadow-slate-700/10">
                                        Bravo Academy Facebook Page
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Technical Responsibilities */}
            <div className="bg-slate-900 py-16 md:py-24 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 md:mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Platform Responsibilities</h2>
                        <div className="mt-4 h-1 w-20 bg-cyan-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                        {[
                            {
                                icon: <Server className="h-6 w-6" />,
                                title: "System Architecture",
                                desc: "End-to-end architecture design focusing on scalability, security, and high-performance backend engineering."
                            },
                            {
                                icon: <Shield className="h-6 w-6" />,
                                title: "Authentication & Control",
                                desc: "Implementation of secure JWT-based authentication and advanced device fingerprinting for session control."
                            },
                            {
                                icon: <Zap className="h-6 w-6" />,
                                title: "Testing Engine",
                                desc: "Development of a highly accurate, time-enforced IQ testing engine tailored for defense selection board standards."
                            },
                            {
                                icon: <BarChart className="h-6 w-6" />,
                                title: "Performance Analytics",
                                desc: "Construction of complex progress evaluation systems and real-time performance analytics for officer candidates."
                            },
                            {
                                icon: <Code className="h-6 w-6" />,
                                title: "Frontend Engineering",
                                desc: "Crafting modern, responsive UI/UX using Next.js to provide an immersive digital testing experience."
                            },
                            {
                                icon: <Shield className="h-6 w-6" />,
                                title: "Production Infrastructure",
                                desc: "Managing global deployment infrastructure, ensuring maximum uptime and data reliability for all users."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-slate-800/40 p-6 md:p-8 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 group">
                                <div className="p-3 bg-blue-600/10 rounded-xl w-fit text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 mb-6 shadow-inner">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 tracking-tight">{item.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Independent Technical Engagements */}
            <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                    <div className="flex-1 text-center lg:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 md:mb-6">Independent Technical Engagements</h2>
                        <p className="text-base md:text-lg text-slate-600 font-semibold mb-3 max-w-2xl mx-auto lg:mx-0">
                            MD. Farhadul Islam
                        </p>
                        <p className="text-base md:text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                            MD. Farhadul Islam is a Computer Science & Engineering student building modern web applications with the MERN stack while strengthening his skills in data structures, algorithms, and software development best practices.
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-center lg:justify-start">
                            <Link href="https://www.linkedin.com/in/md-farhadul-islam-025438373/" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                                <Button className="w-full flex items-center justify-center gap-2 h-12 text-base shadow-lg shadow-slate-400/20">
                                    LinkedIn Profile
                                </Button>
                            </Link>
                            <div className="w-full sm:w-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-slate-600 text-sm md:text-base">
                                <div className="font-semibold text-slate-900 mb-1">Email</div>
                                <div>mi0223937@gmail.com</div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-96 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-sky-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl mx-auto">
                            <Image
                                src="/images/leadership-farhadul.jpg"
                                alt="MD. Farhadul Islam"
                                fill
                                className="object-cover transition duration-500 group-hover:scale-105"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Text */}
            <div className="max-w-7xl mx-auto px-4 pb-16 text-center">
                <p className="text-slate-400 italic text-sm md:text-base max-w-3xl mx-auto">
                    The platform represents a long-term technical investment in building reliable, scalable, and secure digital infrastructure aligned with defense-oriented training standards.
                </p>
            </div>
        </div>
    );
}
