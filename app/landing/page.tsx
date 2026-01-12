"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25" />
                    <span className="text-lg font-semibold tracking-tight">Proofly</span>
                </div>
                <Link
                    href="/create"
                    className="hidden sm:inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-2.5 text-sm font-medium hover:bg-white/10 transition-colors"
                >
                    Launch App
                </Link>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
                <div className={`space-y-8 max-w-3xl transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-2 text-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white/70">Live on Base Sepolia</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                        Turn transaction hashes into{" "}
                        <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            human-readable receipts
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                        Add context to your onchain payments. Share clean, understandable receipts instead of confusing hashes.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link
                            href="/create"
                            className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-4 text-base font-semibold shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-105"
                        >
                            <span>Create a Receipt</span>
                            <svg className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                        <Link
                            href="/me"
                            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-8 py-4 text-base font-medium hover:bg-white/10 transition-colors"
                        >
                            View My Receipts
                        </Link>
                    </div>
                </div>

                {/* Preview Card */}
                <div className={`mt-16 w-full max-w-lg transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl">
                        <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-xs font-medium">
                            Example Receipt
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xl font-semibold">Dinner split 🍕</p>
                                <p className="mt-1 text-sm text-white/60">Paid Alex back for last night. Thanks!</p>
                            </div>
                            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/10">
                                <div>
                                    <p className="text-xs text-white/40">Amount</p>
                                    <p className="font-semibold text-emerald-400">0.015 ETH</p>
                                </div>
                                <div>
                                    <p className="text-xs text-white/40">Network</p>
                                    <p className="font-medium">Base</p>
                                </div>
                                <div>
                                    <p className="text-xs text-white/40">Status</p>
                                    <p className="font-medium text-emerald-400">✓ Verified</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 flex items-center justify-center gap-6 px-6 py-8 text-sm text-white/40">
                <span>Built for the Base Hackathon</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span>Powered by Base</span>
            </footer>
        </div>
    );
}
