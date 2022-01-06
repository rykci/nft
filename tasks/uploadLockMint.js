const { task } = require('hardhat/config')
const fs = require('fs').promises
const { ipfsUpload } = require('./helper/ipfsUpload')
const { mcpUpload } = require('./helper/mcpUpload')
const {
  getAverageUsdcStoragePrice,
} = require('./helper/getAverageUsdcStoragePrice')
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
    const ipfsUploadResponse = await ipfsUpload(_file)

    // cid from both upload should be the same
    //const cid = uploadResponse.data.ipfs_url.split('/').pop()
    const cid = String(ipfsUploadResponse.cid)

    // get the amount of funds to lock
    const usdcPricePerByte = await getAverageUsdcStoragePrice()
    const lockAmount = (usdcPricePerByte * ipfsUploadResponse.size).toString()

    // lock token payment
    console.log('Locking tokens for payment...')
    const txHash = await lockTokenPayment(cid, signer, lockAmount)
    //const txHash = ''

    //generateMetadata(cid, name, desc)
    console.log('Generating JSON metadata...')
    const metadata = generateMetadata(
      cid,
      name,
      desc,
      txHash,
      ipfsUploadResponse.size,
    )

    // upload JSON to MCP
    console.log('Uploading metadata to MCP...')
    /* unsure if i should upload metadata to mcp because we would have to lock payment again
    const metadataUploadResponse = await mcpUpload(
      `${metadata.name}.json`,
      JSON.stringify(metadata),
      signer.address,
    )*/
    //console.log(metadataUploadResponse)
    const ipfsMetadataUploadResponse = await ipfsUpload(
      JSON.stringify(metadata),
    )

    // extract the cid from the response
    //const nftCid = metadataUploadResponse.data.ipfs_url.split('/').pop()
    const nftCid = String(ipfsMetadataUploadResponse.cid)

    // mint NFT!
    console.log('Minting NFT...')
    await mint(nftCid, signer)
  })
