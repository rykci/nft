const { task } = require('hardhat/config')
const fs = require('fs').promises
const { ipfsUpload } = require('./helper/ipfsUpload')
const { mcpUpload } = require('./helper/mcpUpload')
const { paymentInfo } = require('./helper/paymentInfo')
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
    const payload_cid = uploadResponse.data.payload_cid

    console.log(uploadResponse)
    //console.log(ipfsUploadResponse)

    // check if payment is needed
    let txHash = ''
    if (uploadResponse.data?.need_pay % 2 == 0) {
      // get the amount of funds to lock
      console.log('Getting price estimate...')
      const usdcPricePerByte = await getAverageUsdcStoragePrice()
      const lockAmount = (usdcPricePerByte * ipfsUploadResponse.size).toString()

      console.log(lockAmount)

      // lock token payment
      try {
        console.log('Locking tokens for payment...')
        txHash = await lockTokenPayment(payload_cid, signer, lockAmount)
        //const txHash = ''
      } catch (err) {
        console.log('payment transaction failed')
        console.log(err)
        return txHash
      }
    } else {
      //payment already made, find tx_hash
      console.log('Payment already completed, getting tx_hash...')
      const paymentStatus = await paymentInfo(payload_cid)
      txHash = paymentStatus.tx_hash
    }

    console.log(txHash)

    //generateMetadata(cid, name, desc)
    console.log('Generating JSON metadata...')
    const metadata = generateMetadata(
      cid,
      name || fileName,
      desc,
      txHash,
      ipfsUploadResponse.size,
    )

    console.log(metadata)

    // upload JSON to MCP
    console.log('Uploading metadata to IPFS...')
    const metadataUploadResponse = await mcpUpload(
      `${metadata.name}.json`,
      JSON.stringify(metadata),
      signer.address,
      (file_type = 1),
    )
    console.log(metadataUploadResponse)
    const ipfsMetadataUploadResponse = await ipfsUpload(
      JSON.stringify(metadata),
    )

    console.log(ipfsMetadataUploadResponse)

    // extract the cid from the response
    //const nftCid = metadataUploadResponse.data.ipfs_url.split('/').pop()
    const nftCid = String(ipfsMetadataUploadResponse.cid)

    // mint NFT!
    console.log('Minting NFT...')
    await mint(nftCid, signer)
  })
