const { task } = require('hardhat/config')
const { mcpUpload } = require('./helper/mcpUpload')

task('deploy', 'Deploy ERC721 contract with contractURI for opensea')
  .addParam('name', 'name of your NFT collection')
  .addParam('symbol', 'token ticker')
  .addOptionalParam('desc', 'description of the NFT collection')
  .addOptionalParam('image', 'image for the NFT collection (ipfs url)')
  .addOptionalParam('link', 'external link for more info on your collection')
  .addOptionalParam('fee', '100 indicates a 1% seller fee, default is 0')
  .addOptionalParam('recipient', 'where seller fees will be paid to.')
  .setAction(async ({ name, symbol, desc, image, link, fee, recipient }) => {
    const signer = await ethers.getSigner()

    const Minter = await ethers.getContractFactory('Minter')

    const contractMetadata = {
      name: name,
      description: desc,
      image: image,
      external_link: link,
      seller_fee_basis_points: fee,
      fee_recipient: recipient,
    }

    console.log('uploading contract metadata to MCP...')

    const uploadResponse = await mcpUpload(
      `${contractMetadata.name}.json`,
      JSON.stringify(contractMetadata),
      signer.address,
      180,
      1,
    )

    console.log(uploadResponse)

    // extract the cid from the response
    const contractURI = uploadResponse.data.ipfs_url

    console.log('deploying contract...')

    const minter = await upgrades.deployProxy(Minter, [
      signer.address,
      name,
      symbol,
    ])

    await minter.deployed()
    await minter.setContractURI(contractURI)

    console.log(
      'Minter deployed to:',
      minter.address,
      'on network:',
      network.name,
    )
  })
