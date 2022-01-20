// scripts/create-box.js
const { ethers, upgrades } = require('hardhat')

async function main() {
  const Mcpnft = await ethers.getContractFactory('MCPNFT')
  const mcpnft = await upgrades.upgradeProxy(
    '0xF5E01550DBc8cD2f2AB317f2DB67Fc8A2fA4C6cB',
    Mcpnft,
  )
  //await mcpnft.deployed()
  console.log('Box deployed to:', mcpnft.address)
}

main()
