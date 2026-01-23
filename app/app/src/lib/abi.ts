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
      name: "receipts",
      stateMutability: "view",
      inputs: [{ name: "", type: "uint256" }],
      outputs: [
        { name: "creator", type: "address" },
        { name: "recipient", type: "address" },
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
  