"use client";

import Link from "next/link";
import { formatEther, zeroAddress } from "viem";
import { baseSepolia } from "wagmi/chains";
import { useAccount, useChainId, useReadContract, useReadContracts, useSwitchChain } from "wagmi";
import { onchainReceiptAbi } from "@/lib/abi";
import { CONTRACT_ADDRESS } from "@/lib/config";

function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function formatTime(seconds: bigint) {
  const date = new Date(Number(seconds) * 1000);
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export default function MyReceiptsPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const isOnBaseSepolia = chainId === baseSepolia.id;

  const { data: receiptIds, isLoading: isLoadingIds, error: idsError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: onchainReceiptAbi,
    functionName: "getReceiptsByCreator",
    args: [(address ?? "0x0000000000000000000000000000000000000000") as `0x${string}`],
    query: { enabled: Boolean(address) },
  });

  const ids = (receiptIds ?? []).slice().reverse();

  const receiptContracts = ids.map(
    (id) =>
      ({
        address: CONTRACT_ADDRESS,
        abi: onchainReceiptAbi,
        functionName: "receipts",
        args: [id] as const,
      }) as const,
  );

  const { data: receipts, isLoading: isLoadingReceipts } = useReadContracts({
    allowFailure: false,
    contracts: receiptContracts,
    query: { enabled: receiptContracts.length > 0 },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">My Receipts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All receipts created by your connected wallet.
          </p>
        </div>
        <Link
          href="/create"
          className="rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background hover:opacity-90 transition-opacity"
        >
          Create Receipt
        </Link>
      </div>

      {/* Not Connected State */}
      {!isConnected && (
        <div className="rounded-xl border border-border bg-muted/50 p-6">
          <p className="text-sm font-medium text-foreground">Connect your wallet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Use the connect button in the header to view your receipts.
          </p>
        </div>
      )}

      {/* Wrong Network State */}
      {isConnected && !isOnBaseSepolia && (
        <div className="rounded-xl border border-error/20 bg-error/5 p-4">
          <p className="text-sm font-medium text-error">Wrong network</p>
          <p className="mt-1 text-sm text-error/80">
            Please switch to Base Sepolia to view your receipts.
          </p>
          <button
            className="mt-3 rounded-lg bg-error px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-60"
            onClick={() => switchChain({ chainId: baseSepolia.id })}
            disabled={isSwitching}
          >
            {isSwitching ? "Switching…" : "Switch Network"}
          </button>
        </div>
      )}

      {/* Error State */}
      {idsError && (
        <div className="rounded-xl border border-error/20 bg-error/5 p-4 text-sm text-error">
          {idsError.message}
        </div>
      )}

      {/* Loading State */}
      {isConnected && isLoadingIds && (
        <div className="rounded-xl border border-border bg-muted/50 p-6 text-sm text-muted-foreground">
          Loading your receipts…
        </div>
      )}

      {/* Empty State */}
      {isConnected && !isLoadingIds && ids.length === 0 && (
        <div className="rounded-xl border border-border bg-muted/50 p-6">
          <p className="text-sm font-medium text-foreground">No receipts yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first receipt to make your onchain activity easy to understand.
          </p>
          <Link
            href="/create"
            className="mt-4 inline-flex rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity"
          >
            Create Receipt
          </Link>
        </div>
      )}

      {/* Receipts Grid */}
      {isConnected && ids.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {isLoadingReceipts || !receipts
            ? ids.map((id) => (
              <div
                key={id.toString()}
                className="rounded-xl border border-border bg-card p-5"
              >
                <p className="text-sm font-medium text-foreground">Receipt #{id.toString()}</p>
                <p className="mt-1 text-sm text-muted-foreground">Loading…</p>
              </div>
            ))
            : ids.map((id, idx) => {
              const receipt = receipts[idx];
              const recipient = receipt[1];
              const token = receipt[2];
              const amount = receipt[3];
              const timestampSeconds = receipt[4];
              const title = receipt[5];
              const note = receipt[6];

              const isEth = token === zeroAddress;
              const amountValue = isEth ? formatEther(amount) : amount.toString();
              const amountLabel = isEth ? "ETH" : "ERC20";
              const timestamp = timestampSeconds ? formatTime(timestampSeconds) : "—";

              return (
                <Link
                  key={id.toString()}
                  href={`/r/${id.toString()}`}
                  className="group rounded-xl border border-border bg-card p-5 hover:border-accent/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">#{id.toString()}</p>
                      <p className="mt-1 text-base font-semibold text-foreground truncate">
                        {title || "Untitled receipt"}
                      </p>
                    </div>
                    <div className="flex-none rounded-lg bg-muted px-3 py-2 text-right">
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="text-sm font-semibold text-foreground">{amountValue} {amountLabel}</p>
                    </div>
                  </div>

                  {note && (
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{note}</p>
                  )}

                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span>To: <span className="font-mono">{shortAddress(recipient)}</span></span>
                      <span>•</span>
                      <span>{timestamp}</span>
                    </div>
                    <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      View →
                    </span>
                  </div>
                </Link>
              );
            })}
        </div>
      )}
    </div>
  );
}
