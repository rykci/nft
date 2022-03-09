const { task } = require('hardhat/config')
const { generateMetadata } = require('./helper/generateMetadata')
const { mcsUpload } = require('./helper/mcsUpload')
const { paymentInfo } = require('./helper/paymentInfo')
const { mint } = require('./helper/mint')

task('mint', 'Create metadata JSON file for uploaded file and mint as NFT')
  .addParam('uri', 'ipfs URI of the file')
  .addOptionalParam('name', 'name of the NFT')
  .addOptionalParam('desc', 'description of the NFT')
  .addOptionalParam('size', 'size of file')
  .setAction(async ({ uri, name, desc, size }) => {
    const signer = await ethers.getSigner()
    const cid = uri.split('/').pop()
    const hash = (await paymentInfo(cid)).tx_hash
    const metadata = generateMetadata(uri, name, desc, hash, size || '')
    console.log(metadata)

    const uploadResponse = await mcsUpload(
      `${metadata.name}.json`,
      JSON.stringify(metadata),
      signer.address,
      180,
      1,
    )
    console.log(uploadResponse)

    // extract the cid from the response
    const nft_uri = uploadResponse.data.ipfs_url

    // mint NFT!
    console.log('Minting NFT...')
    await mint(signer, nft_uri, cid)
  })
