const mint = async (signer, metadataUri, cid) => {
  const axios = require('axios')

  // get contract information
  const contractAddr = network.config.contract
  const networkName = network.name

  try {
    // Attach contract
    const MinterContract = await ethers.getContractFactory('Minter')
    const databaseMinter = await MinterContract.attach(contractAddr)
    console.log('Contract address: ', contractAddr, ' on network ', networkName)

    // Mint NFT
    console.log('Minting...')
    const startTime = new Date().getTime()
    const tx = await databaseMinter.mintData(signer.address, metadataUri)
    await tx.wait()
    console.log(`Mint Time: ${new Date().getTime() - startTime} ms`)

    // Get tokenID
    const tokenId = await databaseMinter.totalSupply()
    console.log(`NFT ${tokenId} minted. Transaction Hash: ${tx.hash}`)

    // write mint info to db
    const mintInfoJson = {
      payload_cid: cid,
      tx_hash: tx.hash,
      token_id: tokenId.toString(),
      mint_address: contractAddr,
    }

    try {
      const startTime2 = new Date().getTime()
      const mintInfoResponse = await axios
        .post(`${network.config.mcs_api}/storage/mint/info`, mintInfoJson)
        .then((res) => {
          console.log(`Mint Info Time: ${new Date().getTime() - startTime2} ms`)
          return res
        })
    } catch (err) {
      console.log('write mint info error')
      console.log(err)
    }

    // view on opensea
    console.log(
      `View your NFT: ${network.config.openseaUrl}/${networkName}/${contractAddr}/${tokenId}`,
    )
  } catch (err) {
    console.log(err)
  }
}

module.exports = { mint }
