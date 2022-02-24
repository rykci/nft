const { task } = require('hardhat/config')
const { mcsUpload } = require('./helper/mcsUpload')
const {
  getAverageStoragePricePerByte,
} = require('./helper/getAverageStoragePricePerByte')
const { lockTokens } = require('./helper/lockTokens')
const { paymentInfo } = require('./helper/paymentInfo')

const axios = require('axios')
const fs = require('fs').promises
const FormData = require('form-data')
require('dotenv').config

task('upload', 'Upload directory to MCS and lock token payment')
  .addParam('file', 'The path of the file you wish to upload to IPFS')
  .addOptionalParam('duration', 'duration (defaults to 180)')
  .setAction(async ({ file, duration }) => {
    // get signer
    const signer = await ethers.getSigner()
    const _file = await fs.readFile(file) // read file
    const fileName = file.split('/').pop()
    const fileSize = (await fs.stat(file)).size

    const uploadResponse = await mcsUpload(
      fileName,
      _file,
      signer.address,
      duration,
      file.split('.').pop() == 'json' ? 1 : 0,
    ) // upload file to MCS

    console.log(uploadResponse)

    let txHash = ''
    if (uploadResponse.data.need_pay % 2 == 0) {
      console.log('locking tokens...')
      const pricePerByte = await getAverageStoragePricePerByte()
      minPayment = Math.round(pricePerByte * fileSize)
      console.log('min payment: ' + minPayment)

      txHash = await lockTokens(
        uploadResponse.data.payload_cid,
        signer,
        minPayment,
        fileSize,
        uploadResponse.data.source_file_id,
      )
    } else {
      // get existing tx_hash
      console.log('payment found, getting tx hash...')
      const paymentStatus = await paymentInfo(uploadResponse.data.payload_cid)
      txHash = paymentStatus.tx_hash
    }

    console.log(txHash)
  })
