const generateMetadata = (cid, name, description, txHash) => {
  return {
    name: name, // directory name
    description: description,
    image: `${process.env.READ_GATEWAY}${cid}`,
    attributes: [{ value: txHash }],
  }
}

module.exports = { generateMetadata }
