const mint = async (metadataCid) => {
  // get contract information
  const contractAddr = network.config.contract
  const networkName = network.name

  // get signer information
  const [signer] = await ethers.getSigners()

  try {
    // Attach contract
    const MinterContract = await ethers.getContractFactory('DatabaseMinter')
    const databaseMinter = await MinterContract.attach(contractAddr)
    console.log('Contract address: ', contractAddr, ' on network ', networkName)

    // Mint NFT
    console.log('Minting...')
    const tx = await databaseMinter.mintData(signer.address, metadataCid)
    await tx.wait()

    // Get tokenID
    const tokenId = await databaseMinter.totalSupply()
    console.log(`NFT ${tokenId} minted. Transaction Hash: ${tx.hash}`)
  } catch (err) {
    console.log(err)
  }
}

module.exports = { mint }
