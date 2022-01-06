const generateMetadata = (cid, name, description, txHash, fileSize) => {
  return {
    name: name, // directory name
    description: description,
    image: `${process.env.READ_GATEWAY}${cid}`,
    attributes: [
      { trait_type: 'Transaction Hash', value: txHash },
      { trait_type: 'Size', value: fileSize },
    ],
    tx_hash: txHash,
  }
}

module.exports = { generateMetadata }
