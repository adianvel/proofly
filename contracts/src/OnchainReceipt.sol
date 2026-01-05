// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract OnchainReceipt {
    struct Receipt {
        address creator;
        address recipient;
        address token;
        uint256 amount;
        uint256 timestamp;
        string title;
        string note;
    }

    uint256 public nextId;
    mapping(uint256 => Receipt) public receipts;
    mapping(address => uint256[]) private receiptsByCreator;

    event ReceiptCreated(
        uint256 indexed id,
        address indexed creator,
        address indexed recipient,
        address token,
        uint256 amount,
        uint256 timestamp,
        string title
    );

    function createReceipt(
        address recipient,
        string calldata title,
        string calldata note
    ) external payable returns (uint256 id) {
        require(bytes(title).length > 0, "Title required");
        require(bytes(title).length <= 64, "Title too long");
        require(bytes(note).length <= 280, "Note too long");

        id = nextId++;
        receipts[id] = Receipt({
            creator: msg.sender,
            recipient: recipient,
            token: address(0),
            amount: msg.value,
            timestamp: block.timestamp,
            title: title,
            note: note
        });

        receiptsByCreator[msg.sender].push(id);

        if (msg.value > 0) {
            (bool sent, ) = recipient.call{value: msg.value}("");
            require(sent, "ETH transfer failed");
        }

        emit ReceiptCreated(id, msg.sender, recipient, address(0), msg.value, block.timestamp, title);
    }

    function createReceiptWithToken(
        address token,
        address recipient,
        uint256 amount,
        string calldata title,
        string calldata note
    ) external returns (uint256 id) {
        require(token != address(0), "Token required");
        require(bytes(title).length > 0, "Title required");
        require(bytes(title).length <= 64, "Title too long");
        require(bytes(note).length <= 280, "Note too long");
        require(amount > 0, "Amount required");

        bool ok = IERC20(token).transferFrom(msg.sender, recipient, amount);
        require(ok, "ERC20 transfer failed");

        id = nextId++;
        receipts[id] = Receipt({
            creator: msg.sender,
            recipient: recipient,
            token: token,
            amount: amount,
            timestamp: block.timestamp,
            title: title,
            note: note
        });

        receiptsByCreator[msg.sender].push(id);

        emit ReceiptCreated(id, msg.sender, recipient, token, amount, block.timestamp, title);
    }

    function getReceiptsByCreator(address creator) external view returns (uint256[] memory) {
        return receiptsByCreator[creator];
    }
}
