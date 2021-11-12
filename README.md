# nft

## Upload files to IPFS:

Use command `npx hardhat upload --dir <PATH>` to upload your directory to our IPFS server.
It will also upload metadata to IPFS.
The CID of the image directory and metadata directory will be logged to the console.

## Deploy Contract

Deploy the DatabaseMinter contract by running script `npx hardhat run scripts/deploy.js` and store the contract address in a .env file with key `CONTRACT_ADDRESS`.

## Minting NFT

Use command `npx hardhat mint --cid <CID>` to mint NFT to the Mumbai network (default)

## TokenURI

Use command `npx hardhat tokenURI --id <tokenID>` to retrieve the tokenURI of a minted NFT.
