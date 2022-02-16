const { task } = require('hardhat/config')
const { mcpUpload } = require('./helper/mcpUpload')
const {
  getAverageStoragePricePerByte,
} = require('./helper/getAverageStoragePricePerByte')
const { lockTokens } = require('./helper/lockTokens')

const axios = require('axios')
const fs = require('fs').promises
const FormData = require('form-data')

task('upload', 'Upload directory to MCP and lock token payment')
  .addParam('file', 'The path of the file you wish to upload to IPFS')
  .addOptionalParam('duration', 'duration (defaults to 180)')
  .setAction(async ({ file, duration }) => {
    // get signer
    const signer = await ethers.getSigner()
    const _file = await fs.readFile(file) // read file
    const fileName = file.split('/').pop()
    const fileSize = (await fs.stat(file)).size

    console.log('Uploading file to MCP...')
    const uploadResponse = await mcpUpload(
      fileName,
      _file,
      signer.address,
      duration,
      file.split('.').pop() == 'json' ? 1 : 0,
    ) // upload file to MCP

    console.log(uploadResponse)

    console.log('locking tokens...')
    const pricePerByte = await getAverageStoragePricePerByte()
    const lockAmount = Math.round(pricePerByte * fileSize)
    const txHash = await lockTokens(
      uploadResponse.data.payload_cid,
      signer,
      lockAmount,
      fileSize,
    )
    console.log(txHash)
  })
