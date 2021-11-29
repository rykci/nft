const { task } = require('hardhat/config')
const axios = require('axios')
const fs = require('fs').promises
const FormData = require('form-data')
require('dotenv').config()

task('mcp', 'Upload file to MCP and mint NFT')
  .addParam('file', '')
  .addOptionalParam('name', '')
  .addOptionalParam('description', '')
  .setAction(async (taskArgs) => {
    if (!network.config.mcp.authToken) {
      console.log('Please Login for Auth Token')
    } else {
      const file = await fs.readFile(taskArgs.file) // read file

      const upload = await mcpUpload(taskArgs.file.split('/').pop(), file) // upload file to MCP

      // generate metadata using the file CID
      // wait for MCP API to update return values
      /*
      const metadata = generateMetadata(
        taskArgs.name || `${taskArgs.file.split('.').pop()}.json`,
        taskArgs.description,
        upload.cid,
        upload.txHash,
      )
      */

      // const metadataUpload = await mcpUpload(metadata) // upload JSON to MCP
      // await mint(metadataUpload.cid) // mint NFT!
    }
  })

const mcpUpload = async (fileName, file, duration = 180) => {
  const form = new FormData()
  form.append('duration', duration)
  form.append('file', file, fileName)

  await axios
    .post(network.config.mcp.uploadUrl, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${network.config.mcp.authToken}`,
      },
    })
    .then(
      (response) => {
        console.log(response.data)
      },
      (error) => {
        console.log(error)
      },
    )

  // return fileCid, pinStatus, deal_id, deal_cid, status, txHash
}

const generateMetadata = (name, description, cid, hash) => {
  return JSON.stringify({
    name: name, // directory name
    description: description,
    data: `${process.env.READ_GATEWAY}${cid}`,
    paymentHash: hash,
  })
}

const mint = async (metadataCid) => {
  const contractAddr = network.config.contract
  const networkId = network.name
  console.log('Contract address: ', contractAddr, ' on network ', networkId)

  const MinterContract = await ethers.getContractFactory('DatabaseMinter')

  //Get signer information
  const [signer] = await ethers.getSigners()

  //Mint NFT
  console.log('Minting...')
  const databaseMinter = await MinterContract.attach(contractAddr)
  const tx = await databaseMinter.mintData(signer.address, metadataCid)
  await tx.wait()
  const tokenId = await databaseMinter.totalSupply()
  console.log(`NFT ${tokenId} minted. Transaction Hash: ${tx.hash}`)
}
