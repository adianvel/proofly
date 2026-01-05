# 📄 PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Project: **Proofly**

---

## 1. Product Overview

**Product Name:** Proofly
**Category:** Web3 Mini-App / Onchain UX Tool
**Blockchain:** Base (Base Sepolia for MVP)
**Platform:** Web Application (dApp)

**Product Statement:**
Proofly is a Web3 mini-app that improves onchain user experience by transforming raw blockchain transactions into human-readable, shareable receipts that can be understood by non-technical users.

---

## 2. Background & Problem Statement

Blockchain provides transparency and immutability, but the way transactions are presented today is still highly technical. Transactions are represented by hashes, addresses, and raw data that are difficult for non-technical users to understand.

### Core Problems Identified

1. **Transaction hashes are not human-readable**
   Non-technical users cannot easily interpret what a transaction represents or why it occurred.

2. **Lack of context and intent**
   Blockchain transactions record what happened, but not the human intent behind them (e.g. payment purpose, reimbursement, donation).

3. **Block explorers are developer-centric**
   Existing explorers are built for verification and debugging, not for everyday communication or proof sharing.

As a result, blockchain transactions are difficult to explain, share, or use as social proof, creating a UX barrier to broader adoption.

---

## 3. Problem Formulation

> **How can blockchain transactions be made understandable, explainable, and verifiable for non-technical users without changing the underlying blockchain protocol?**

---

## 4. Proposed Solution

Proofly introduces a **human-readable UX layer** on top of blockchain transactions.

Instead of forcing users to interpret raw transaction hashes, the application allows users to:

* perform transactions through a dApp,
* attach human context (title, note, recipient),
* store that context immutably onchain,
* and present the transaction as a readable receipt.

The blockchain remains unchanged; only the user experience is improved.

---

## 5. Goals & Objectives

### Primary Goals

* Improve onchain UX for everyday blockchain transactions.
* Reduce friction for non-technical users interacting with Web3.
* Provide a clear, shareable proof of onchain activity.

### Success Criteria

* Users can create and view receipts successfully.
* Receipts are understandable without blockchain knowledge.
* Application can be easily demonstrated and evaluated by hackathon judges.

---

## 6. Target Users

### Primary Users

* Web3 users performing peer-to-peer transactions.
* Developers and hackathon judges evaluating UX improvements.

### Secondary Users

* Communities, DAOs, and event organizers.
* Non-technical users who need proof of payment or activity.

---

## 7. User Stories

* As a user, I want to attach context to my transaction so others understand its purpose.
* As a recipient, I want to view a readable receipt instead of a transaction hash.
* As a user, I want to share a receipt link as proof of payment.
* As a non-technical user, I want to understand what a blockchain transaction means.

---

## 8. Application Flow

### High-Level Flow

1. User opens the web application.
2. User connects their wallet.
3. User creates a transaction with contextual information.
4. Transaction is processed on Base.
5. Receipt is stored onchain.
6. Receipt is displayed in a human-readable format.
7. Receipt can be revisited or shared via URL.

---

## 9. Feature Requirements

### Core Features (MVP)

#### 9.1 Wallet-Based Access

* Wallet connection as the only form of authentication.
* No traditional accounts or credentials.

#### 9.2 Create Proofly

* Input title (required).
* Input note (optional).
* Specify recipient address.
* Send ETH value (optional).
* Submit transaction on Base.

#### 9.3 Human-Readable Receipt View

* Receipt displayed with:

  * Title
  * Note
  * Sender address
  * Recipient address
  * Amount
  * Timestamp

#### 9.4 Shareable Receipt Link

* Each receipt has a public URL.
* Anyone can view the receipt without connecting a wallet.

#### 9.5 Receipt History

* Users can view all receipts created by their wallet.
* Receipts act as an archive of onchain proof.

---

## 10. Out of Scope (MVP)

* ERC20 token support
* Mobile native applications
* Backend servers or APIs
* Traditional databases
* Offchain storage (IPFS)
* DeFi logic or yield mechanisms
* Token issuance

These are intentionally excluded to maintain clarity and focus.

---

## 11. Technical Architecture

### Architecture Overview

The application follows a **pure onchain architecture**:

```
User
 ↓
Next.js Frontend (UI / UX)
 ↓
wagmi + viem
 ↓
Smart Contract on Base
```

### Key Decisions

* No backend server.
* No centralized database.
* Smart contract acts as the source of truth.
* Wallet address serves as user identity.

---

## 12. Data Model (Onchain)

```solidity
struct Receipt {
  address creator;
  address recipient;
  uint256 amount;
  uint256 timestamp;
  string title;
  string note;
}
```

---

## 13. UX Principles

* Simplicity over complexity.
* Human language over technical jargon.
* Minimal steps to complete actions.
* Clear visual hierarchy.
* Immediate feedback after transactions.

---

## 14. Business Model (Future)

Proofly follows a **freemium approach**:

* Core receipt functionality remains free.
* Future monetization may include:

  * Premium receipt features (branding, verification badges).
  * Exportable receipts (PDF).
  * Platform or DAO integrations.
* Focus is on adoption first, monetization later.

---

## 15. Hackathon Alignment

### Track Fit

**Base Track – Build a Mini-App Improving Onchain UX**

### Why It Fits

* Built entirely on Base.
* Focuses on UX rather than protocol complexity.
* Addresses a real adoption barrier.
* Demonstrates how Base can support everyday transactions with better UX.

---

## 16. Risks & Mitigation

| Risk                        | Mitigation                            |
| --------------------------- | ------------------------------------- |
| UX misunderstood by users   | Clear copy and simple layout          |
| Over-simplification concern | Explicit explanation of onchain proof |
| Scalability questions       | Clearly defined MVP scope             |

---

## 17. Future Enhancements

* Token-based receipts
* ENS name resolution
* Receipt verification badges
* Advanced search and filtering
* Notifications and alerts

---

## 18. Summary

Proofly is a focused Web3 mini-app that improves onchain UX by translating technical blockchain transactions into human-readable receipts. By prioritizing clarity, simplicity, and trust, the application lowers the barrier for non-technical users to interact with blockchain systems while remaining fully decentralized and verifiable.