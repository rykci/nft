const generateMetadata = (cid, name, description, tx_hash, size) => {
  return {
    name: name, // directory name
    description: description,
    image: cid,
    tx_hash: tx_hash,
    attributes: [{ trait_type: 'Size', value: size }],
  }
}

module.exports = { generateMetadata }
