const { task } = require('hardhat/config')
const axios = require('axios')
const fs = require('fs').promises
const FormData = require('form-data')
require('dotenv').config()

task('mcp', 'Upload file to MCP and mint NFT')
  .addParam('file', '')
  .addOptionalParam('name', '')
  .addOptionalParam('desc', '')
  .setAction(async (taskArgs) => {
    if (!network.config.mcp.authToken) {
      console.log('Please Login for Auth Token')
    } else {
      const file = await fs.readFile(taskArgs.file) // read file

      console.log('Uploading file to MCP...')
      const upload = await mcpUpload(taskArgs.file.split('/').pop(), file) // upload file to MCP

      // generate metadata using the file CID
      // currently MCP API does not show txHash
      console.log('Generating metadata...')
      const metadata = generateMetadata(
        taskArgs.name || `${taskArgs.file.split('.')[0]}.json`,
        taskArgs.desc,
        upload.cid,
        //upload.txHash,
      )

      // Display JSON file
      console.log(JSON.stringify(metadata))

      // upload JSON to MCP
      console.log('Uploading metadata to MCP...')
      const metadataUpload = await mcpUpload(
        metadata.name,
        JSON.stringify(metadata),
      )

      await mint(metadataUpload.cid) // mint NFT!
    }
  })

const mcpUpload = async (fileName, file, duration = 180) => {
  const form = new FormData()
  form.append('duration', duration)
  form.append('file', file, fileName)

  let result = { cid: '' }

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
        const cid = response.data.data.ipfs_url.split('/').pop()
        result.cid = cid
      },
      (error) => {
        console.log(error)
      },
    )

  return result
  // return fileCid, pinStatus, deal_id, deal_cid, status, txHash
}

const generateMetadata = (
  name,
  description,
  cid, //hash
) => {
  return {
    name: name, // directory name
    description: description,
    data: `${process.env.READ_GATEWAY}${cid}`,
    //paymentHash: hash,
  }
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
