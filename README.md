# Proofly

Proofly is a Web3 mini-app that turns Base transactions into human-readable, shareable receipts. It adds context (title, note, recipient) to onchain activity without changing the underlying protocol.

## What is here

- `app/`: Next.js app router directory.
- `/`: Next.js frontend project root using wagmi + viem.
- `contracts/`: Foundry smart contracts (Base Sepolia for MVP).
- `app-summary.md`: Product requirements and UX goals.

## Quickstart

### Frontend (Next.js)

```bash
npm install
```

Create `.env.local` (example values shown below):

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_CHAIN_ID=84532
```

Run the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

### Contracts (Foundry)

```bash
cd contracts
forge build
forge test
```

For deployments, set `BASE_SEPOLIA_RPC_URL` and `PRIVATE_KEY` in `contracts/.env`, then use the scripts in `contracts/script`.

## Notes

- The MVP targets Base Sepolia (chain id `84532`).
- The app shows receipts with title, note, sender/recipient, amount, and timestamp.

## Learn more

- Frontend details: `README.frontend.md`
- Contracts usage: `contracts/README.md`
