require('dotenv').config

const ipfsUpload = async (fileBuffer) => {
  const { create } = require('ipfs-http-client')

  const ipfs = await create('https://ipfs.infura.io:5001/')

  try {
    return await ipfs.add(
      fileBuffer,
      //{ wrapWithDirectory: true }
    )
  } catch (err) {
    console.error(err)
  }
}

module.exports = { ipfsUpload }
