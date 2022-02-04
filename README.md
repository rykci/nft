# NFT

**Technology Stack**: Javascript, Node.js, Solidity, Hardhat

## Prerequisites

This project was coded using Node version 16.3.0. \
If you do not already have node installed, [Download and install node](https://nodejs.org/en/download/).

## Install from Source

### Checkout Source Code

```
git clone https://github.com/filswan/nft
cd nft
```

### Install Dependancies

Run `npm install` to install all dependancies.

### Setting Up Environmental Variables

Set up an .env file which stores your
information as environment variables. \
An example config is given as .env.example for reference.

- `MUMBAI_URL`: Mumbai RPC to interact with the payment and minting smart contract
- `PRIVATE_KEY`: Your ETH wallet's private key used to pay for transactions

## Deploy Contract

Deploy the Minter contract using `npx hardhat run scripts/createMinter.js`. \
Since `Minter.sol` is an upgradeable smart contract, this script will deploy a proxy. \
You can also add `--network <NETWORK_NAME>` to specify which network to deploy to.

## Run Tests

Some tests are written under the `./test/` folder. These can be run using `npx hardhat test`
