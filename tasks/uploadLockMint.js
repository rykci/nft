const { task } = require('hardhat/config')
const fs = require('fs').promises
const { mcpUpload } = require('./helper/mcpUpload')
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

    //generateMetadata(cid, name, desc)
    console.log('Generating JSON metadata...')
    const metadata = generateMetadata(
      uploadResponse.data.ipfs_url,
      name || fileName,
      desc,
      '',
      uploadResponse.file_size,
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
