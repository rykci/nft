# NFT

This project allows the user to easily deploy their own ERC721 contracts,
as well as minting their own NFTs via IPFS using the terminal

**Technology Stack**: Javascript, Node.js, Solidity, Hardhat

## Contracts

This project was coded with the [Hardhat SDK](https://hardhat.org/) and [Openzeppelin contracts](https://github.com/OpenZeppelin/openzeppelin-contracts/).

- `Minter`: OwnableUpgradeable ERC721 contract to mint NFTs
- `MinterFactory`: Factory contract that creates Minter instances.

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
- `MCS_API` : Endpoint to interact with MCS API
- `FILSWAN_API` : Endpoint to interact with Filswan API

## Deploy Contract

Deploy the Minter contract using `npx hardhat deploy --name <COLLECTION_NAME> --symbol <TOKEN_TICKER>` . \
Since `Minter.sol` is an upgradeable smart contract, this script will deploy a proxy. \
You can also add `--network <NETWORK_NAME>` to specify which network to deploy to. \
Currently, the default network is the **Mumbai testnet**

Additional parameters can be added to provide metadata for your collection

- `--desc`: Collection description
- `--image`: URL of an image for your collection (preferably IPFS URI)
- `--link`: An external link to your website (usually to provide more information about your NFT)
- `--fee`: here you can set a trading fee for you NFTs (a value of 100 indicates a 1% fee)
- `--recipient`: the address where the seller fees will be paid to

**Store the contract address in the `hardhat.config.js` with key `contract` under the correct network.**

## Run Tests

Some tests are written under the `./test/` folder. These can be run using `npx hardhat test`

## Mint From Terminal

Use command npx hardhat `uploadLockMint --file <PATH>`. This script uses helper functions to:

- upload the file to MCS
- lock token payment (will need some USDC)
- generate metadata JSON
- upload metadata to MCS
- mint NFT

Optional params include `--name <NFT_NAME> and --desc <NFT_DESCRIPTION>` The metadata will look like:

```
{
    name: <NFT_NAME> // defaults to the name of file,
    description: <NFT_DESCRIPTION>,
    image: <READ_GATEWAY> + <IPFS_CID>,
    attributes: [{trait_type: 'Size', value: <FILE_SIZE>}],
    tx_hash: <LOCK_TOKEN_TX_HASH>
}
```

Alternatively, you can also use other commands for a step-by-step process.

1. Use `npx hardhat upload --file <PATH>` to upload your file to MCS and lock token payment.
2. Use `npx hardhat mint --cid <FILE_CID>` to generate NFT metadata, upload to MCS, and mint
   - Optional parameters include `--name <NFT_NAME>` and `--desc <NFT_DESCRIPTION>`

## Token URI

Use command `npx hardhat tokenURI --id <tokenID>` to retrieve the tokenURI of a minted NFT.

## View Your NFT!

After minting, the NFT should be available to view on OpenSea (testnet). \
You can search for your collection (your deployed contract) using the contract address here: \
https://testnets.opensea.io/get-listed

Select the correct network and paste the contract address. Your collection will be opened on a new tab. \
NFT metadata will take some time to load, Opensea will call the tokenURI function in the contract to refresh the metadata.
