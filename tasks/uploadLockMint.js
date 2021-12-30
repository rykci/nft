const { task } = require('hardhat/config')
const fs = require('fs').promises
const { mcpUpload } = require('./helper/mcpUpload')
const { lockTokenPayment } = require('./helper/lockTokenPayment')
const { generateMetadata } = require('./helper/generateMetadata')
const { mint } = require('./helper/mint')

task('uploadLockMint', 'single task, to upload file, lock tokens, and mint nft')
  .addParam('file', 'file to upload')
  .addOptionalParam('name', 'name of nft')
  .addOptionalParam('desc', 'desc of nft')
  .setAction(async ({ file, name, desc }) => {
    // get signer
    const signer = await ethers.getSigner()
    const _file = await fs.readFile(file) // read file
    const fileName = file.split('/').pop()

    // upload file to MCP
    console.log('Uploading file to MCP...')
    const uploadResponse = await mcpUpload(fileName, _file, signer.address)
    //console.log(uploadResponse)

    const cid = uploadResponse.data.ipfs_url.split('/').pop()

    // lock token payment
    console.log('Locking tokens for payment...')
    const txHash = await lockTokenPayment(cid, signer)

    //generateMetadata(cid, name, desc)
    console.log('Generating JSON metadata...')
    const metadata = generateMetadata(cid, name, desc, txHash)

    // upload JSON to MCP
    console.log('Uploading metadata to MCP...')
    const metadataUploadResponse = await mcpUpload(
      `${metadata.name}.json`,
      JSON.stringify(metadata),
      signer.address,
    )
    //console.log(metadataUploadResponse)

    // extract the cid from the response
    const nftCid = metadataUploadResponse.data.ipfs_url.split('/').pop()

    // mint NFT!
    console.log('Minting NFT...')
    await mint(nftCid, signer)
  })
