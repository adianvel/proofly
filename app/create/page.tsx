"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatEther, formatUnits, isAddress, parseEther, parseUnits, zeroAddress } from "viem";
import { useAccount, useChainId, useReadContract, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { erc20Abi, onchainReceiptAbi } from "@/lib/abi";
import { CONTRACT_ADDRESS } from "@/lib/config";

function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function txUrl(hash: `0x${string}`) {
  return `https://sepolia.basescan.org/tx/${hash}`;
}

export default function CreatePage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const [recipient, setRecipient] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [amountEth, setAmountEth] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const { writeContract: writeReceipt, data: receiptHash, isPending: isSubmitting, error: writeError } = useWriteContract();
  const { writeContract: writeApproval, data: approvalHash, isPending: isApproving, error: approvalError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: receiptHash });
  const { isLoading: isApprovalConfirming, isSuccess: isApprovalConfirmed } = useWaitForTransactionReceipt({ hash: approvalHash });

  const isOnBaseSepolia = chainId === baseSepolia.id;
  const recipientTrimmed = recipient.trim();
  const titleTrimmed = title.trim();
  const noteTrimmed = note.trim();
  const tokenTrimmed = tokenAddress.trim();

  const isRecipientValid = recipientTrimmed.length > 0 && isAddress(recipientTrimmed);
  const isTokenMode = tokenTrimmed.length > 0;
  const isTokenValid = isTokenMode && isAddress(tokenTrimmed);

  const { data: tokenDecimals } = useReadContract({
    address: (isTokenValid ? tokenTrimmed : zeroAddress) as `0x${string}`,
    abi: erc20Abi,
    functionName: "decimals",
    query: {
      enabled: isTokenValid,
    },
  });

  const { data: tokenSymbol } = useReadContract({
    address: (isTokenValid ? tokenTrimmed : zeroAddress) as `0x${string}`,
    abi: erc20Abi,
    functionName: "symbol",
    query: {
      enabled: isTokenValid,
    },
  });

  const { data: tokenAllowance, refetch: refetchAllowance } = useReadContract({
    address: (isTokenValid ? tokenTrimmed : zeroAddress) as `0x${string}`,
    abi: erc20Abi,
    functionName: "allowance",
    args: [(address ?? zeroAddress) as `0x${string}`, CONTRACT_ADDRESS],
    query: {
      enabled: isTokenValid && Boolean(address),
    },
  });

  const tokenDecimalsValue = Number(tokenDecimals ?? 18);
  const tokenDecimalsSafe = Number.isFinite(tokenDecimalsValue) ? tokenDecimalsValue : 18;
  const tokenSymbolSafe = typeof tokenSymbol === "string" && tokenSymbol.length > 0 ? tokenSymbol : "TOKEN";

  let parsedAmount: bigint | null = null;
  try {
    parsedAmount = isTokenMode
      ? parseUnits(amountEth.trim() || "0", tokenDecimalsSafe)
      : parseEther(amountEth.trim() || "0");
  } catch {
    parsedAmount = null;
  }

  const needsApproval =
    isTokenMode &&
    isTokenValid &&
    parsedAmount !== null &&
    parsedAmount > 0n &&
    (tokenAllowance ?? 0n) < parsedAmount;

  const amountDisplay =
    parsedAmount === null
      ? ""
      : isTokenMode
        ? `${formatUnits(parsedAmount, tokenDecimalsSafe)} ${tokenSymbolSafe}`
        : `${formatEther(parsedAmount)} ETH`;

  const approvalPending = isApproving || isApprovalConfirming;
  const amountLabel = isTokenMode ? `Amount (${tokenSymbolSafe})` : "Amount (ETH)";
  const errorMessage = formError ?? approvalError?.message ?? writeError?.message;

  useEffect(() => {
    if (isApprovalConfirmed) {
      refetchAllowance();
    }
  }, [isApprovalConfirmed, refetchAllowance]);

  const { data: myReceiptIds } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: onchainReceiptAbi,
    functionName: "getReceiptsByCreator",
    args: [(address ?? "0x0000000000000000000000000000000000000000") as `0x${string}`],
    query: {
      enabled: Boolean(address) && isConfirmed,
    },
  });

  const latestReceiptId =
    myReceiptIds && myReceiptIds.length > 0 ? myReceiptIds[myReceiptIds.length - 1] : undefined;

  const approveToken = () => {
    setFormError(null);

    if (!isConnected) return setFormError("Please connect your wallet first.");
    if (!isOnBaseSepolia) return setFormError("Please switch to Base Sepolia network.");
    if (!isTokenMode) return setFormError("Please enter a token address.");
    if (!isTokenValid) return setFormError("Please enter a valid token address.");
    if (!parsedAmount || parsedAmount === 0n) return setFormError("Please enter a token amount.");

    writeApproval({
      address: tokenTrimmed as `0x${string}`,
      abi: erc20Abi,
      functionName: "approve",
      args: [CONTRACT_ADDRESS, parsedAmount],
      chainId: baseSepolia.id,
    });
  };

  const submit = () => {
    setFormError(null);

    if (!isConnected) return setFormError("Please connect your wallet first.");
    if (!isOnBaseSepolia) return setFormError("Please switch to Base Sepolia network.");
    if (!titleTrimmed) return setFormError("Please add a title for your receipt.");
    if (!isRecipientValid) return setFormError("Please enter a valid recipient address.");
    if (isTokenMode && !isTokenValid) return setFormError("Please enter a valid token address.");
    if (parsedAmount === null)
      return setFormError(`Please enter a valid ${isTokenMode ? "token" : "ETH"} amount.`);

    if (isTokenMode) {
      if (parsedAmount === 0n) return setFormError("Please enter a token amount.");
      if (needsApproval) return setFormError("Please approve the token first.");

      writeReceipt({
        address: CONTRACT_ADDRESS,
        abi: onchainReceiptAbi,
        functionName: "createReceiptWithToken",
        args: [
          tokenTrimmed as `0x${string}`,
          recipientTrimmed as `0x${string}`,
          parsedAmount,
          titleTrimmed,
          noteTrimmed,
        ],
        chainId: baseSepolia.id,
      });
      return;
    }

    writeReceipt({
      address: CONTRACT_ADDRESS,
      abi: onchainReceiptAbi,
      functionName: "createReceipt",
      args: [recipientTrimmed as `0x${string}`, titleTrimmed, noteTrimmed],
      value: parsedAmount,
      chainId: baseSepolia.id,
    });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create Receipt</h1>
        <p className="text-sm text-muted-foreground">
          Create a human-readable receipt for any blockchain transaction. Simple, clear, verifiable.
        </p>
      </div>

      {/* Network Warning */}
      {!isOnBaseSepolia && isConnected && (
        <div className="rounded-xl border border-error/20 bg-error/5 p-4">
          <p className="text-sm font-medium text-error">Wrong network</p>
          <p className="mt-1 text-sm text-error/80">
            Please switch to Base Sepolia to create a receipt.
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

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form Section */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="space-y-5">
              {/* Chain Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Network</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none cursor-pointer"
                    value={chainId}
                    onChange={(e) => {
                      const selectedChainId = Number(e.target.value);
                      if (selectedChainId !== chainId) {
                        switchChain({ chainId: selectedChainId });
                      }
                    }}
                    disabled={isSwitching}
                  >
                    <option value={baseSepolia.id}>Base Sepolia (Testnet)</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {!isOnBaseSepolia && isConnected && (
                  <p className="text-xs text-error">Your wallet is on a different network. Select a network above to switch.</p>
                )}
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Title</label>
                <input
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  placeholder="What is this payment for?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Token Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Token <span className="text-muted-foreground font-normal">(select currency)</span>
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none cursor-pointer"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                  >
                    <option value="">ETH</option>
                    <option value="0x036CbD53842c5426634e7929541eC2318f3dCF7e">USDC</option>
                    <option value="0x4200000000000000000000000000000000000006">WETH</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {tokenAddress === "" ? "Send ETH" : `Send ${tokenSymbolSafe} token`}
                </p>
              </div>

              {/* Recipient & Amount */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Recipient</label>
                  <input
                    className={`w-full rounded-lg border bg-background px-4 py-3 font-mono text-sm placeholder:text-muted-foreground focus:outline-none ${recipientTrimmed.length === 0
                      ? "border-border focus:border-accent"
                      : isRecipientValid
                        ? "border-border focus:border-accent"
                        : "border-error focus:border-error"
                      }`}
                    placeholder="0x..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    spellCheck={false}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{amountLabel}</label>
                  <input
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                    placeholder="0.00"
                    inputMode="decimal"
                    value={amountEth}
                    onChange={(e) => setAmountEth(e.target.value)}
                  />
                </div>
              </div>

              {/* Note Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Note <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  className="min-h-[100px] w-full resize-y rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  placeholder="Add any additional details..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="rounded-lg border border-error/20 bg-error/5 p-3 text-sm text-error">
                  {errorMessage}
                </div>
              )}

              {isTokenMode && needsApproval && (
                <button
                  className="w-full rounded-lg border border-border bg-card py-3.5 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-60"
                  disabled={!isConnected || !isOnBaseSepolia || approvalPending || isSubmitting || isConfirming}
                  onClick={approveToken}
                >
                  {approvalPending ? "Approving..." : "Approve Token"}
                </button>
              )}

              {/* Submit Button */}
              <button
                className="w-full rounded-lg bg-foreground py-3.5 text-sm font-medium text-background hover:opacity-90 transition-opacity disabled:opacity-60"
                disabled={
                  !isConnected ||
                  !isOnBaseSepolia ||
                  isSubmitting ||
                  isConfirming ||
                  approvalPending ||
                  (isTokenMode && needsApproval)
                }
                onClick={submit}
              >
                {isSubmitting ? "Confirm in wallet…" : isConfirming ? "Creating receipt…" : "Create Receipt"}
              </button>

              <p className="text-xs text-muted-foreground text-center">
                This data will be stored permanently onchain and publicly visible.
              </p>
            </div>

            {/* Success State */}
            {receiptHash && (
              <div className="mt-6 rounded-lg border border-success/20 bg-success/5 p-4">
                <p className="font-medium text-success">✓ Receipt created successfully</p>
                <a
                  href={txUrl(receiptHash)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block font-mono text-xs text-muted-foreground hover:text-foreground break-all"
                >
                  {receiptHash}
                </a>
                {isConfirmed && latestReceiptId !== undefined && (
                  <div className="mt-3 flex gap-3">
                    <Link
                      href={`/r/${latestReceiptId.toString()}`}
                      className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity"
                    >
                      View Receipt
                    </Link>
                    <Link
                      href="/me"
                      className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      All Receipts
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-muted/50 p-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">Preview</p>
            <div className="space-y-4">
              <div>
                <p className="text-lg font-semibold text-foreground">{titleTrimmed || "Untitled receipt"}</p>
                <p className="mt-1 text-sm text-muted-foreground">{noteTrimmed || "No note added."}</p>
              </div>

              <div className="h-px bg-border" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-medium text-foreground">
                    {(() => {
                      try {
                        return amountDisplay || "";
                      } catch {
                        return "—";
                      }
                    })()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Network</p>
                  <p className="font-medium text-foreground">Base Sepolia</p>
                </div>
                {isTokenMode && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Token</p>
                    <p className="font-medium text-foreground">
                      {tokenSymbolSafe}
                    </p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">From</p>
                  <p className="font-mono text-sm text-foreground">
                    {isConnected && address ? shortAddress(address) : "Not connected"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">To</p>
                  <p className="font-mono text-sm text-foreground break-all">
                    {recipientTrimmed || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-foreground">Why add context?</p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              A clear title and note makes your transaction understandable for anyone reviewing it later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
