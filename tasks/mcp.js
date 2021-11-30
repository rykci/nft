const { task } = require('hardhat/config')
const axios = require('axios')
const fs = require('fs').promises
const FormData = require('form-data')
require('dotenv').config()
const { mint } = require('./helper/mint')
const { generateMetadata } = require('./helper/generateMetadata')

task('mcp', 'Upload file to MCP and mint NFT')
  .addParam('file', '')
  .addOptionalParam('name', '')
  .addOptionalParam('desc', '')
  .setAction(async (taskArgs) => {
    if (!network.config.mcp.authToken) {
      console.log('Please Login for Auth Token')
    } else {
      const file = await fs.readFile(taskArgs.file) // read file
      const fileName = taskArgs.file.split('/').pop()

      console.log('Uploading file to MCP...')
      const uploadResponse = await mcpUpload(fileName, file) // upload file to MCP
      console.log(uploadResponse)

      // extract the cid from the response
      const uploadCid = uploadResponse.data.ipfs_url.split('/').pop()

      // generate metadata using the file CID
      // currently MCP API does not show txHash
      console.log('Generating metadata...')
      const metadata = generateMetadata(
        taskArgs.name || `${taskArgs.file.split('.')[0]}`,
        taskArgs.desc,
        uploadCid,
      )

      // Display JSON file
      console.log(JSON.stringify(metadata))

      // upload JSON to MCP
      console.log('Uploading metadata to MCP...')
      const metadataUploadResponse = await mcpUpload(
        `${metadata.name}.json`,
        JSON.stringify(metadata),
      )
      console.log(metadataUploadResponse)

      // extract the cid from the response
      const nftCid = metadataUploadResponse.data.ipfs_url.split('/').pop()

      // mint NFT!
      await mint(nftCid)
    }
  })

const mcpUpload = async (fileName, file, duration = 180) => {
  const form = new FormData()
  form.append('duration', duration)
  form.append('file', file, fileName)

  try {
    const response = await axios.post(network.config.mcp.uploadUrl, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${network.config.mcp.authToken}`,
      },
    })
    return response.data
  } catch (err) {
    // Handle Error Here
    console.error(err)
  }
}
