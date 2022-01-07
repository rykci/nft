const { task } = require('hardhat/config')
const { generateMetadata } = require('./helper/generateMetadata')
const { ipfsUpload } = require('./helper/ipfsUpload')

task('metadata', 'Create metadata JSON file for uploaded file')
  .addParam('cid', 'cid of the file')
  .addOptionalParam('name', 'name of the NFT')
  .addOptionalParam('desc', 'description of the NFT')
  .addOptionalParam('size', 'size of the NFT')
  .addOptionalParam('hash', 'tx_hash for the storage payment')
  .setAction(async ({ cid, name, desc, size, hash }) => {
    const metadata = generateMetadata(cid, name, desc, hash, size)
    console.log(metadata)

    const ipfsMetadataUploadResponse = await ipfsUpload(
      JSON.stringify(metadata),
    )
    console.log(ipfsMetadataUploadResponse)
  })
