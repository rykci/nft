# nft

# Install from Source

## Checkout Source Code

```
git clone https://github.com/filswan/nft
cd nft
```

## Build Source Code

#### Install Dependancies

Run `npm install` to install all dependancies.

#### Setting Up Environmental Variables

Set up and customize configuration by making modifications on .env file, which stores your information as environment variables. An example config is given as .env.example for reference.

Modify the `.env` file based on your use cases:

- `MUMBAI_URL`: API gateway on top of the Matic network
- `RINKEBY_URL`: API gateway on top of the Rinkeby network
- `PRIVATE_KEY`: Your wallet's private key used to pay for transactions
- `READ_GATEWAY`: An available ipfs address with port need to be set up. For example, `https://MyIpfsUrl:Port`
- `WRITE_GATEWAY`: An available ipfs address with port need to be set up for file downloading. For example, `https://MyIpfsGatewayUrl:Port`

Note we use Mumbai and Rinkeby because those are the supported networks on Opensea. \
Additionally, Using MCP requires more `.env` setup:

- `MCP_EMAIL`: The email used to log into MCP
- `MCP_PASSWORD` The passward used to log into MCP
- `MCP_AUTH_TOKEN` : A valid MCP token is required for requests on MCP API. It can be received after log in through the API
- `MCP_LOGIN_URL`: Endpoint to preform a log in request
- `MCP_UPLOAD_URL`: Endpoint to preform an upload request

# Deploy Contract

Deploy the `DatabaseMinter` contract using `npx hardhat deploy.js` and **store the contract address** in the `hardhat.config.js` with key `CONTRACT_ADDRESS` under the correct network.

Optional parameters to name your NFT collection. Each deployed contract is a seperate collection.

- `--name`: Name of the collection, defaults to 'Databases'
- `--symbol`: Token ticker, defaults to 'DATA'
- `--base`: Base URL for TokenURI, defaults to the `READ_GATEWAY`

Ex. `npx hardhat deploy --name 'My Collection' --symbol 'MYCOL' --base "https://ipfs.io/ipfs/`

# Preparing your file 📁

If you wish to upload multiple files, the files should be in one directory then zipped or made into .car format.

#### Pack directory into .car

Use `npx hardhat pack --dir <PATH>` to pack a directory into a .car file of the same name.

#### Pack directory into .zip

Use `npx hardhat zip --dir <PATH>` to pack a directory into a .zip file of the same name.

This method will upload your file(s) to IPFS using read gateway such as https://ipfs.io/ipfs/

# Using MCP

If you also set up the MCP variables in `.env`, then you can use MCP service to upload your files to IPFS.

## Log in to MCP

Use `npx hardhat login` to send a login request to MCP API. Upon receiving a success status, it should include an `auth_token`. **Store this token** in your `.env` file with key `MCP_AUTH_TOKEN`

## Upload File to MCP

Use command `npx hardhat mcp --file <PATH>` to upload your file to MCP IPFS server.
It will also upload metadata to IPFS.

Optional parameters include `--name` and `--desc` to write to the JSON file to name and describe your NFT. (The name defaults to the file name)

Ex. `npx hardhat mcp --file my-image.png --name "My NFT" --desc "This is my image as an NFT"`

#### Minting your NFT

This `mcp` command will also generate a metadata JSON file and mint your uploaded file for you.

# Using Your Own IPFS Gateway

Alternatively you can use your own IPFS Gateway instead of MCP.

## Upload files to IPFS:

Use command `npx hardhat upload --file <PATH>` to upload your .car file to your IPFS server.
It will also upload metadata to IPFS.
The CID of the uploaded file followed by the CID of the metadata JSON file will be logged to the console.

Optional parameters include `--name` and `--desc` to write to the JSON file to name and describe your NFT. (The name defaults to the file name)

Ex. `npx hardhat upload --file my-image.png --name "My NFT" --desc "This is my image as an NFT"`

## Minting NFT

Use command `npx hardhat mint --cid <CID>` to mint NFT to the Mumbai network (default)

- `--cid`: This should be the CID of the metadata file uploaded to IPFS
- `--network`: This is an optional parameter to set the network (for example rinkeby)

The process is logged to the console. When complete the transaction hash will be shown along with the NFT token ID

# TokenURI

Use command `npx hardhat tokenURI --id <tokenID>` to retrieve the tokenURI of a minted NFT.

# View NFT!

After minting, the NFT should be available to view on OpenSea (testnet). You can search for your collection (your deployed contract) using the contract address here: https://testnets.opensea.io/get-listed

Select the correct network and paste the contract address. Your collection will be opened on a new tab. NFT metadata will take some time to load, Opensea will call the tokenURI function in the contract to refresh the metadata.
