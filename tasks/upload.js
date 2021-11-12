const { task } = require('hardhat/config')
const { create } = require('ipfs-http-client')
const fs = require('fs').promises
require('dotenv').config()

task('upload', 'Upload directory to IPFS')
  .addParam('dir', 'The path of the directory to upload')
  .setAction(async (taskArgs) => {
    // reate an instance of the HTTP API client
    const ipfs = create(process.env.WRITE_GATEWAY)

    // read the directory
    const dir = await fs.readdir(taskArgs.dir)

    // maps files to array of objects for ipfs addAll function
    const files = await Promise.all(
      dir.map(async (file) => {
        return {
          path: file,
          content: await fs.readFile(`${taskArgs.dir}/${file}`),
        }
      }),
    )

    const fileData = await uploadToIPFS(ipfs, files)
    const dirData = fileData.pop()
    console.log(dirData)

    // gets name of directory rather than the whole path
    const metadataName = taskArgs.dir.split('/').pop()

    const fileMetadata = {
      path: `${metadataName}.json`,
      content: JSON.stringify({
        name: metadataName, // directory name
        image: `${process.env.READ_GATEWAY}QmQbF9mJEYUdLaWgw568abFiwvR1udQsfmuLyhejTiZ2DG`, // placeholder database icon for opensea
        directory: `${process.env.READ_GATEWAY}${dirData.cid}`, // gateway to files of directory on IPFS
      }),
    }

    const metadata = await uploadToIPFS(ipfs, fileMetadata, false)

    console.log(metadata.pop())
  })

const uploadToIPFS = async (ipfs, files, wrap = true) => {
  let fileData = []

  // uploads each file and wraps with a directory
  for await (const file of ipfs.addAll(files, {
    wrapWithDirectory: wrap,
    progress: (bytes, file) => {
      console.log(`Uploading ${file} Bytes: ${bytes}`)
    },
  })) {
    //console.log(file)

    /* addAll returns object for each added file
      path: file name,
      cid: ipfs hash,
      size: size of file
    */
    fileData.push(file)
  }

  return fileData
}
