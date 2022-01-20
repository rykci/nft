# nft

**Technology stack**: hardhat + web3

## Prerequisites

This project was coded using Node version 17.3.0. \
If you do not already have node installed, [Download and install node](https://nodejs.org/en/download/).

## Install from Source

### Checkout Source Code

```
git clone https://github.com/filswan/nft
cd nft
```

### Build Source Code

#### Install Dependancies

Run `npm install` to install all dependancies.

#### Setting Up Environmental Variables

Set up and customize configuration by making modifications on .env file, which stores your \
informationas environment variables. An example config is given as .env.example for reference.

- `MUMBAI_URL`: Mumbai RPC to interact with the payment and minting smart contract
- `PRIVATE_KEY`: Your wallet's private key used to pay for transactions
- `READ_GATEWAY`: An available ipfs address with port need to be set up. For example, `ipfs://`
- `MCP_UPLOAD_URL`: Endpoint to preform an upload request
- `MCP_FILECOIN_PRICE_URL`: Endpoint to retrieve the current price of Filecoin to USDC
- `MCP_PAYMENT_INFO_URL`: Endpoint to retrieve payment info on an uploaded file
- `SWAN_STORAGE_STATS_URL`: Endpoint to retrieve the average price for storage per GB
- `RECIPIENT_ADDRESS`: Address of the FS3 service provider
- `USDC_ADDRESS`: Address of the USDC token
- `SWAN_PAYMENT_ADDRESS`: Address of the Swan Payment contract used to pay for file storage

## Deploy Contract

Deploy the `DatabaseMinter` contract using `npx hardhat deploy.js` and
**store the contract \
address** in the `hardhat.config.js` with key `contract` under the correct network.

Optional parameters for your NFT collection. Each deployed contract is a seperate collection.

- `--name`: Name of the collection, defaults to 'Databases'
- `--symbol`: Token ticker, defaults to 'DATA'
- `--base`: Base URL for TokenURI, defaults to the `READ_GATEWAY`

Ex. `npx hardhat deploy --name 'My Collection' --symbol 'MYCOL' --base "https://ipfs.io/ipfs/`

## Preparing your file 📁

If you wish, your file(s) can be zipped into .zip format

#### Pack directory into .zip

Use `npx hardhat zip --dir <PATH>` to pack a directory into a .zip file of the same name. \
Optionally, add `--out <PATH>` to specify the path for the output file \
(defaults to same location as input file).

## Uploading your file(s) as NFTs

Use command `npx hardhat uploadLockMint --file <PATH>`.
This script uses helper functions to:

- upload the file(s)
- get average storage price
- lock token payment
- generate metadata JSON
- upload metadata
- mint NFT

Optional params include `--name <NFT_NAME>` and `--desc <NFT_DESCRIPTION>`
The metadata will look like:

```
{
    name: <NFT_NAME> // defaults to the name of file,
    description: <NFT_DESCRIPTION>,
    image: <READ_GATEWAY> + <IPFS_CID>,
    attributes: [{trait_type: "Size", value: <FILE_SIZE>}],
    tx_hash: <PAYMENT_TX_HASH>
}
```

## TokenURI

Use command `npx hardhat tokenURI --id <tokenID>` to retrieve the tokenURI of a minted NFT.

## View NFT!

After minting, the NFT should be available to view on OpenSea (testnet). \
You can search for your collection (your deployed contract) using the contract address here: \
https://testnets.opensea.io/get-listed

Select the correct network and paste the contract address. Your collection will be opened on a new tab. \
NFT metadata will take some time to load, Opensea will call the tokenURI function in the contract to refresh the metadata.
