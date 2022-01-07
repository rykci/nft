const { task } = require('hardhat/config')
const { mcpUpload } = require('./helper/mcpUpload')
const { ipfsUpload } = require('./helper/ipfsUpload')

const axios = require('axios')
const fs = require('fs').promises
const FormData = require('form-data')

task('upload', 'Upload directory to IPFS using MCP API')
  .addParam('file', 'The path of the file you wish to upload to IPFS')
  .addOptionalParam('duration', 'duration (defaults to 180)')
  .setAction(async ({ file, duration }) => {
    // get signer
    const signer = await ethers.getSigner()
    const _file = await fs.readFile(file) // read file
    const fileName = file.split('/').pop()

    console.log('Uploading file to MCP...')
    const uploadResponse = await mcpUpload(
      fileName,
      _file,
      signer.address,
      duration,
    ) // upload file to MCP

    const ipfsUploadResponse = await ipfsUpload(_file)
    console.log(uploadResponse)
    console.log(ipfsUploadResponse)
  })
