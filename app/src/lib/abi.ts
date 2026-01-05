export const onchainReceiptAbi = [
    {
      type: "function",
      name: "createReceipt",
      stateMutability: "payable",
      inputs: [
        { name: "recipient", type: "address" },
        { name: "title", type: "string" },
        { name: "note", type: "string" },
      ],
      outputs: [{ name: "id", type: "uint256" }],
    },
    {
      type: "function",
      name: "createReceiptWithToken",
      stateMutability: "nonpayable",
      inputs: [
        { name: "token", type: "address" },
        { name: "recipient", type: "address" },
        { name: "amount", type: "uint256" },
        { name: "title", type: "string" },
        { name: "note", type: "string" },
      ],
      outputs: [{ name: "id", type: "uint256" }],
    },
    {
      type: "function",
      name: "receipts",
      stateMutability: "view",
      inputs: [{ name: "", type: "uint256" }],
      outputs: [
        { name: "creator", type: "address" },
        { name: "recipient", type: "address" },
        { name: "token", type: "address" },
        { name: "amount", type: "uint256" },
        { name: "timestamp", type: "uint256" },
        { name: "title", type: "string" },
        { name: "note", type: "string" },
      ],
    },
    {
      type: "function",
      name: "getReceiptsByCreator",
      stateMutability: "view",
      inputs: [{ name: "creator", type: "address" }],
      outputs: [{ name: "", type: "uint256[]" }],
    },
] as const;

export const erc20Abi = [
    {
      type: "function",
      name: "decimals",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "", type: "uint8" }],
    },
    {
      type: "function",
      name: "symbol",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "", type: "string" }],
    },
    {
      type: "function",
      name: "allowance",
      stateMutability: "view",
      inputs: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
      ],
      outputs: [{ name: "", type: "uint256" }],
    },
    {
      type: "function",
      name: "approve",
      stateMutability: "nonpayable",
      inputs: [
        { name: "spender", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      outputs: [{ name: "", type: "bool" }],
    },
] as const;
