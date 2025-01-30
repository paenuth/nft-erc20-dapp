# NFT ERC-20 DApp

This project demonstrates how to deploy and interact with an NFT and ERC-20 token on a local Ethereum network using Hardhat.

## Overview

This DApp includes:
- **ERC-20 Token**: A simple ERC-20 token contract that can be minted and transferred.
- **NFT Contract**: A mintable NFT contract that allows users to mint unique NFTs.
- **Local Hardhat Network**: The project runs on a local Ethereum testnet (`localhost`), allowing you to deploy and interact with smart contracts.

## Requirements

Before running this project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or later)
- [Hardhat](https://hardhat.org/getting-started/) (`npm install --save-dev hardhat`)
- Metamask Browser Extension

To verify installation, run:
```bash
node -v
npx hardhat --version
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Hardhat: Ensure the `hardhat.config.js` file is set up for your local network.

## Running the Local Ethereum Network

1. **Start the local Ethereum node:**
   ```bash
   npx hardhat node
   ```
   This will start a local Ethereum network at `http://localhost:8545` with pre-funded accounts.

2. **Deploy the contracts:**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```
   This will deploy the ERC-20 token and NFT contracts, displaying their addresses in the terminal.

3. **Update contract addresses:**
   - Open `config.js` and update the ERC-20 and NFT contract addresses to match the deployed contract addresses from the terminal.

## Running the Frontend

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   npm start
   ```
2. Open `http://localhost:3000` in your browser.
3. Click **Mint NFT**, enter your Metamask password, and confirm the transaction.
4. Ensure Metamask is connected to Hardhat's local test network.

## Connecting Metamask to Hardhat

1. Open Metamask and go to **Networks > Add Custom Network**.
2. Enter the following details:
   - **Network Name:** Hardhat
   - **RPC URL:** `http://localhost:8545`
   - **Chain ID:** `31337`
   - **Currency Symbol:** ETH

## Troubleshooting

- **Contract Interaction Issues:** Ensure you are using the correct account (usually Account #0 from `npx hardhat node`).
- **Local Node Not Running:** Make sure the Hardhat network is active before interacting with the contract.
- **Metamask Connection Problems:** Check that Metamask is connected to the Hardhat network and using the correct Chain ID (31337).

