const { task } = require('hardhat/config')
const fs = require('fs').promises
const { mcpUpload } = require('./helper/mcpUpload')
const {
  getAverageStoragePricePerByte,
} = require('./helper/getAverageStoragePricePerByte')
const { lockTokens } = require('./helper/lockTokens')
const { paymentInfo } = require('./helper/paymentInfo')
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

    const payload_cid = uploadResponse.data.payload_cid

    console.log(uploadResponse)

    const fileSize = (await fs.stat(file)).size
    console.log('file size: ' + fileSize + ' bytes')

    // check if the file needs payment
    let txHash = ''
    if (uploadResponse.data.need_pay % 2 == 0) {
      // payment
      const pricePerByte = await getAverageStoragePricePerByte()
      const lockAmount = Math.round(pricePerByte * fileSize)
      console.log('lock amount: ' + lockAmount)

      // lockTokens
      try {
        console.log('locking tokens...')
        txHash = await lockTokens(payload_cid, signer, lockAmount, fileSize)
      } catch (err) {
        console.log('payment transaction failed')
        console.log(err)
        return txHash
      }
    } else {
      // get existing tx_hash
      console.log('payment found, getting tx hash...')
      const paymentStatus = await paymentInfo(payload_cid)
      txHash = paymentStatus.tx_hash
    }

    console.log('tx hash: ' + txHash)

    // generateMetadata(cid, name, desc)
    console.log('Generating JSON metadata...')
    const metadata = generateMetadata(
      uploadResponse.data.ipfs_url,
      name || fileName,
      desc,
      txHash,
      fileSize,
    )

    console.log(metadata)

    // upload JSON to MCP
    console.log('Uploading metadata to IPFS...')
    const metadataUploadResponse = await mcpUpload(
      `${metadata.name}.json`,
      JSON.stringify(metadata),
      signer.address,
      180,
      1,
    )
    console.log(metadataUploadResponse)

    // extract the cid from the response
    const nft_uri = metadataUploadResponse.data.ipfs_url

    // mint NFT!
    console.log('Minting NFT...')
    await mint(signer, nft_uri)
  })
