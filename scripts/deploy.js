require('dotenv').config()

async function main() {
  const DatabaseMinter = await ethers.getContractFactory('DatabaseMinter')
  const dataminter = await DatabaseMinter.deploy(
    'MCP NFT TEST',
    'MCPNFT',
    //process.env.READ_GATEWAY,
    'ipfs://',
  )

  await dataminter.deployed()

  console.log(
    `Contract deployed to: ${dataminter.address} on network ${network.name}`,
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
