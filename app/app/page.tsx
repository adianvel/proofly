"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#FDFCF6]">
      {/* Neo Brutalism Background Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 border-4 border-black/10 rotate-12" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-accent/10 border-4 border-black/10 -rotate-6" />
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-yellow-200/30 border-4 border-black/10 rotate-45" />
        <div className="absolute top-1/3 right-1/3 w-16 h-16 border-4 border-black/10 rounded-full" />
      </div>

      {/* Navbar - Sticky with blur */}
      <header className="sticky top-0 z-50 bg-[#FDFCF6]/90 backdrop-blur-md border-b-4 border-black">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 py-4 lg:px-8">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/proofly-logo.png"
              alt="Proofly"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="text-xl font-bold text-foreground">Proofly</span>
          </Link>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/create" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Create
            </Link>
            <Link href="/me" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              My Receipts
            </Link>
            <a href="https://sepolia.basescan.org" target="_blank" rel="noreferrer" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Explorer
            </a>
          </nav>

          {/* Right: Connect Wallet */}
          {!mounted ? (
            <button className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white opacity-60" disabled>
              Connect Wallet
            </button>
          ) : !isConnected ? (
            <button
              onClick={() => connect({ connector: injected() })}
              disabled={isConnecting}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
                {shortAddress(address!)}
              </span>
              <button
                onClick={() => disconnect()}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section - 2 Column */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left Content (60%) */}
          <div className="lg:col-span-3 space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Make Blockchain Transactions{" "}
              <span className="text-accent">Human-Readable.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Stop sharing confusing hashes. Turn your Base transactions into beautiful, shareable Prooflys in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/create"
                className="inline-flex items-center justify-center gap-2 bg-accent px-8 py-4 text-base font-bold text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                Create New Receipt
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center bg-white px-8 py-4 text-base font-bold text-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                How it works
              </a>
            </div>
          </div>

          {/* Right Content (40%) - Receipt Preview */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Receipt Card - Neo Brutalism */}
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Proofly Receipt</span>
                  <span className="flex items-center gap-1 text-xs font-medium text-success">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Verified
                  </span>
                </div>
                <div className="pt-2">
                  <p className="text-xl font-bold text-foreground">Dinner Split</p>
                  <p className="mt-1 text-sm text-muted-foreground">Paying back Alex for last night's dinner. Thanks!</p>
                </div>
                <div className="h-px bg-border" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="font-bold text-foreground">0.025 ETH</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Network</p>
                    <p className="font-bold text-foreground">Base</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">To</p>
                    <p className="font-mono text-foreground">0x1234...5678</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-bold text-foreground">Dec 21, 2025</p>
                  </div>
                </div>
              </div>
              {/* Jagged edge effect */}
              <div className="absolute -bottom-3 left-4 right-4 h-3 bg-card border-l border-r border-b border-border rounded-b-xl" style={{
                clipPath: "polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)"
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* Why Proofly Section */}
      <section id="how-it-works" className="bg-muted py-20 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-16">
            Why Proofly?
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-card rounded-2xl border border-border p-8 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">Immutable Context</h3>
              <p className="text-muted-foreground">Attach titles and notes that stay onchain forever.</p>
            </div>
            {/* Card 2 */}
            <div className="bg-card rounded-2xl border border-border p-8 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">Human-Centric</h3>
              <p className="text-muted-foreground">Designed for non-technical users to understand 'why' a tx happened.</p>
            </div>
            {/* Card 3 */}
            <div className="bg-card rounded-2xl border border-border p-8 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">One-Click Share</h3>
              <p className="text-muted-foreground">Public URLs that anyone can view without a wallet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-white">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-16">
          <div className="grid sm:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="sm:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Image src="/proofly-logo.png" alt="Proofly" width={32} height={32} className="h-8 w-8" />
                <span className="text-lg font-bold text-accent">Proofly</span>
              </div>
              <p className="text-sm text-gray-400">Human-readable onchain receipts.</p>
            </div>
            {/* Product */}
            <div>
              <h4 className="font-bold text-accent mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/create" className="hover:text-accent transition-colors">Create</Link></li>
                <li><Link href="/me" className="hover:text-accent transition-colors">History</Link></li>
                <li><a href="#" className="hover:text-accent transition-colors">Verification</a></li>
              </ul>
            </div>
            {/* Ecosystem */}
            <div>
              <h4 className="font-bold text-accent mb-4">Ecosystem</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://base.org" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Base</a></li>
                <li><a href="https://www.coinbase.com/wallet" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Coinbase Wallet</a></li>
                <li><a href="https://farcaster.xyz" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Farcaster</a></li>
              </ul>
            </div>
            {/* Resources */}
            <div>
              <h4 className="font-bold text-accent mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Github</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Docs</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">© 2025 Proofly</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" /></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-accent transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
