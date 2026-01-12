"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import { formatEther, formatUnits, zeroAddress } from "viem";
import { useReadContract } from "wagmi";
import { erc20Abi, onchainReceiptAbi } from "@/lib/abi";
import { CONTRACT_ADDRESS } from "@/lib/config";

function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function formatTime(seconds: bigint) {
  const date = new Date(Number(seconds) * 1000);
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function addressUrl(address: `0x${string}`) {
  return `https://sepolia.basescan.org/address/${address}`;
}

export default function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [copied, setCopied] = useState(false);

  const receiptId = useMemo(() => {
    if (!id) return null;
    if (!/^\d+$/.test(id)) return null;
    try {
      return BigInt(id);
    } catch {
      return null;
    }
  }, [id]);

  const { data: receipt, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: onchainReceiptAbi,
    functionName: "receipts",
    args: [receiptId ?? BigInt(0)],
    query: { enabled: receiptId !== null },
  });

  const tokenAddress = (receipt?.[2] ?? zeroAddress) as `0x${string}`;
  const isToken = tokenAddress !== zeroAddress;

  const { data: tokenDecimals } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "decimals",
    query: { enabled: Boolean(receipt) && isToken },
  });

  const { data: tokenSymbol } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "symbol",
    query: { enabled: Boolean(receipt) && isToken },
  });

  const tokenDecimalsValue = Number(tokenDecimals ?? 18);
  const tokenDecimalsSafe = Number.isFinite(tokenDecimalsValue) ? tokenDecimalsValue : 18;
  const tokenSymbolSafe = typeof tokenSymbol === "string" && tokenSymbol.length > 0 ? tokenSymbol : "TOKEN";
  const amountDisplay =
    receipt && !isToken
      ? `${formatEther(receipt[3])} ETH`
      : receipt
        ? `${formatUnits(receipt[3], tokenDecimalsSafe)} ${tokenSymbolSafe}`
        : "";

  const missing =
    receipt &&
    receipt[4] === BigInt(0) &&
    receipt[0] === "0x0000000000000000000000000000000000000000";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Proofly Receipt</p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground mt-1">
            {receipt?.[5] ? receipt[5] : receiptId !== null ? `Receipt #${receiptId.toString()}` : "Receipt"}
          </h1>
        </div>
        <Link
          href="/create"
          className="hidden sm:inline-flex rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          Create your own
        </Link>
      </div>

      {/* Error States */}
      {receiptId === null && (
        <div className="rounded-xl border border-error/20 bg-error/5 p-6">
          <p className="text-sm font-medium text-error">Invalid receipt ID</p>
          <p className="mt-1 text-sm text-error/80">
            This link doesn't look right. Please check the URL.
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-error/20 bg-error/5 p-6 text-sm text-error">
          {error.message}
        </div>
      )}

      {/* Loading State */}
      {receiptId !== null && isLoading && (
        <div className="rounded-xl border border-border bg-muted/50 p-6 text-sm text-muted-foreground">
          Loading receipt…
        </div>
      )}

      {/* Receipt Content */}
      {receipt && !missing && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Receipt Card */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-border">
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Receipt #{receiptId?.toString()}</p>
                  <p className="mt-1 text-xl font-semibold text-foreground">{receipt[5] || "Untitled receipt"}</p>
                  {receipt[6] && (
                    <p className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {receipt[6]}
                    </p>
                  )}
                </div>
                <div className="flex-none rounded-lg bg-muted px-4 py-3 text-right">
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="text-lg font-semibold text-foreground">{amountDisplay}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid gap-4 sm:grid-cols-2 pt-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">From</p>
                  <a
                    href={addressUrl(receipt[0])}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-2 font-mono text-sm text-foreground hover:text-accent transition-colors"
                  >
                    {shortAddress(receipt[0])}
                    <span className="text-muted-foreground">↗</span>
                  </a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">To</p>
                  <a
                    href={addressUrl(receipt[1])}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-2 font-mono text-sm text-foreground hover:text-accent transition-colors"
                  >
                    {shortAddress(receipt[1])}
                    <span className="text-muted-foreground">↗</span>
                  </a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Date</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{formatTime(receipt[4])}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Network</p>
                  <p className="mt-1 text-sm font-medium text-foreground">Base Sepolia</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Asset</p>
                  {isToken ? (
                    <a
                      href={addressUrl(tokenAddress)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-2 font-mono text-sm text-foreground hover:text-accent transition-colors"
                    >
                      {shortAddress(tokenAddress)}
                      <span className="text-muted-foreground">{tokenSymbolSafe}</span>
                    </a>
                  ) : (
                    <p className="mt-1 text-sm font-medium text-foreground">ETH</p>
                  )}
                </div>
              </div>

              {/* Verification Badge */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-success">
                  <span>✓</span>
                  <span>Verified onchain</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm font-medium text-foreground">Share this receipt</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Send this link instead of a transaction hash.
              </p>
              <button
                className="mt-4 w-full rounded-lg bg-foreground py-2.5 text-sm font-medium text-background hover:opacity-90 transition-opacity"
                onClick={copyLink}
              >
                {copied ? "✓ Copied!" : "Copy Link"}
              </button>
            </div>

            <div className="rounded-xl border border-border bg-muted/50 p-5">
              <p className="text-sm font-medium text-foreground">Create your own</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Make a receipt in under a minute.
              </p>
              <Link
                href="/create"
                className="mt-4 block w-full rounded-lg border border-border bg-card py-2.5 text-center text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Create Receipt
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Not Found State */}
      {receipt && missing && (
        <div className="rounded-xl border border-border bg-muted/50 p-6">
          <p className="text-sm font-medium text-foreground">Receipt not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This receipt ID doesn't exist onchain.
          </p>
          <Link
            href="/create"
            className="mt-4 inline-flex rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity"
          >
            Create a Receipt
          </Link>
        </div>
      )}
    </div>
  );
}
