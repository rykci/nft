const { task } = require('hardhat/config')
require('dotenv').config()

task('mint', 'mint NFT supplying contract and tokenURI')
  .addParam('cid', 'IPFS cid of the NFT metadata')
  .setAction(async (taskArgs) => {
    const contractAddr = process.env.CONTRACT_ADDRESS
    const networkId = network.name
    console.log('Contract address: ', contractAddr, ' on network ', networkId)

    const MinterContract = await ethers.getContractFactory('DatabaseMinter')

    //Get signer information
    const [signer] = await ethers.getSigners()

    //Mint NFT
    console.log('Minting...')
    const databaseMinter = await MinterContract.attach(contractAddr)
    const tx = await databaseMinter.mintData(signer.address, taskArgs.cid)
    await tx.wait()
    console.log('NFT minted. Transaction Hash: ', tx.hash)
  })
