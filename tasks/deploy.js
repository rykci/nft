const { task } = require('hardhat/config')

require('dotenv').config()

task('deploy', 'Deploy DatabaseMinter Smart Contract')
  .addOptionalParam('name', 'name of the NFT collection')
  .addOptionalParam('symbol', 'NFT symbol')
  .addOptionalParam('base', 'baseURL for tokenURIs')
  .setAction(async (taskArgs) => {
    const DatabaseMinter = await ethers.getContractFactory('DatabaseMinter')
    const dataminter = await DatabaseMinter.deploy(
      taskArgs.name || 'Databases',
      taskArgs.symbol || 'DATA',
      taskArgs.base || process.env.READ_GATEWAY,
    )

    await dataminter.deployed()

    console.log(
      `Contract deployed to: ${dataminter.address} on network ${network.name}`,
    )
  })
