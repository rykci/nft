# nft

## Pack directory into .car

Use `npx hardhat pack --dir <PATH>` to pack a directory into a .car file of the same name. The upload command will be logged to the console.

## Upload files to IPFS:

Use command `npx hardhat upload --car <PATH>.car` to upload your .car file to our IPFS server.
It will also upload metadata to IPFS.
The CID of the .car file and metadata JSON file will be logged to the console.

## Deploy Contract

Deploy the DatabaseMinter contract by running script `npx hardhat run scripts/deploy.js` and store the contract address in a .env file with key `CONTRACT_ADDRESS`.

## Minting NFT

Use command `npx hardhat mint --cid <CID>` to mint NFT to the Mumbai network (default)

## TokenURI

Use command `npx hardhat tokenURI --id <tokenID>` to retrieve the tokenURI of a minted NFT.
