"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount, useChainId, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { injected } from "wagmi/connectors";
import { baseSepolia } from "wagmi/chains";

function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function AppHeader() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const isOnBaseSepolia = chainId === baseSepolia.id;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
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

        {/* Right: Wallet */}
        <div className="flex items-center gap-3">
          {!mounted ? (
            <button className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white opacity-60" disabled>
              Connect
            </button>
          ) : (
            <>
              {isConnected && (
                <span
                  className={`hidden sm:inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${isOnBaseSepolia
                    ? "bg-success/10 text-success"
                    : "bg-error/10 text-error"
                    }`}
                >
                  {isOnBaseSepolia ? "Base Sepolia" : "Wrong Network"}
                </span>
              )}

              {isConnected && !isOnBaseSepolia && (
                <button
                  className="hidden sm:inline-flex rounded-full border border-border px-4 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                  onClick={() => switchChain({ chainId: baseSepolia.id })}
                  disabled={isSwitching}
                >
                  {isSwitching ? "Switching…" : "Switch"}
                </button>
              )}

              {!isConnected ? (
                <button
                  className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                  onClick={() => connect({ connector: injected() })}
                  disabled={isConnecting}
                >
                  {isConnecting ? "Connecting…" : "Connect Wallet"}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-flex rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent font-mono">
                    {shortAddress(address!)}
                  </span>
                  <button
                    className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    onClick={() => disconnect()}
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
