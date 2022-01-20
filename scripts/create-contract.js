const { ethers, upgrades } = require('hardhat')

async function main() {
  const Mcpnft = await ethers.getContractFactory('MCPNFT')
  const mcpnft = await upgrades.deployProxy(Mcpnft, [])
  await mcpnft.deployed()
  console.log('mcpnft deployed to:', mcpnft.address)
}

main()
