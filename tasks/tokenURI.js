const { task } = require('hardhat/config')

require('dotenv').config()

task('tokenURI', 'get tokenURI for minted NFT')
  .addParam('id', 'tokenID of the NFT')
  .setAction(async (taskArgs) => {
    const contractAddr = network.config.contract
    const MinterContract = await ethers.getContractFactory('DatabaseMinter')
    const databaseMinter = await MinterContract.attach(contractAddr)
    const uri = await databaseMinter.tokenURI(taskArgs.id)
    console.log(`Token ${taskArgs.id} URI: ${uri}`)
  })
