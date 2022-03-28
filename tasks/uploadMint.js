const { task } = require('hardhat/config')
const fs = require('fs')
const axios = require('axios')
const { mcsUpload } = require('./helper/mcsUpload')
const {
  getAverageStoragePricePerByte,
} = require('./helper/getAverageStoragePricePerByte')
const { lockTokens } = require('./helper/lockTokens')
const { paymentInfo } = require('./helper/paymentInfo')
const { generateMetadata } = require('./helper/generateMetadata')
const { mint } = require('./helper/mint')

task('uploadMint', 'single task to upload file, lock tokens, and mint nft')
  .addParam('file', 'file to upload')
  .addOptionalParam('name', 'name of nft')
  .addOptionalParam('desc', 'desc of nft')
  .setAction(async ({ file, name, desc }) => {
    // get signer
    const signer = await ethers.getSigner()
    const _file = fs.createReadStream(file) // read file
    const fileName = file.split('/').pop()

    // upload file to MCS
    const uploadResponse = await mcsUpload(fileName, _file, signer.address)
    const payload_cid = uploadResponse.data.payload_cid
    console.log(uploadResponse)

    const fileSize = (await fs.promises.stat(file)).size
    console.log('file size: ' + fileSize + ' bytes')

    // check if the file needs payment
    let txHash = ''
    if (uploadResponse.data.need_pay % 2 == 0) {
      // payment
      const pricePerByte = await getAverageStoragePricePerByte()
      const minPayment = Math.round(pricePerByte * fileSize * 180)
      console.log('min amount: ' + minPayment)

      // lockTokens
      try {
        console.log('locking tokens...')
        txHash = await lockTokens(
          payload_cid,
          signer,
          minPayment,
          fileSize,
          uploadResponse.data.source_file_id,
        )
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

    // upload JSON to MCS
    const metadataUploadResponse = await mcsUpload(
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
    await mint(signer, nft_uri, payload_cid)
  })
