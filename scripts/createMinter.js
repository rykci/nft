const { ethers } = require('hardhat')

async function main() {
  // We get the contract to deploy
  const admin = await ethers.getSigner()

  const Minter = await ethers.getContractFactory('Minter')
  const minter = await upgrades.deployProxy(Minter, [
    admin.address,
    'Test Token',
    'TTKN',
  ])

  await minter.deployed()

  console.log(
    'Minter deployed to:',
    minter.address,
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
