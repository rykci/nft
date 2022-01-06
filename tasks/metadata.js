const { task } = require('hardhat/config')
const { generateMetadata } = require('./helper/generateMetadata')

task('metadata', 'Create metadata JSON file for uploaded file')
  .addParam('cid', 'cid of the file')
  .addOptionalParam('name', 'name of the NFT')
  .addOptionalParam('desc', 'description of the NFT')
  .addOptionalParam('attributes', 'attributes of the NFT')
  .setAction(async ({ cid, name, desc, attributes }) => {
    const metadata = generateMetadata(cid, name, desc, attributes)
    console.log(metadata)
  })
