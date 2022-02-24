const { ethers, upgrades } = require('hardhat')

async function main() {
  // We get the contract to deploy
  const MinterFactory = await ethers.getContractFactory('MinterFactory')
  const factory = await upgrades.deployProxy(MinterFactory, [])

  await factory.deployed()

  console.log(
    'MinterFactory deployed to:',
    factory.address,
    'on network:',
    network.name,
  )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
