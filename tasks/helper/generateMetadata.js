const generateMetadata = (name, description, cid, attributes = undefined) => {
  return {
    name: name, // directory name
    description: description,
    data: `${process.env.READ_GATEWAY}${cid}`,
    attributes: attributes,
  }
}

module.exports = { generateMetadata }
