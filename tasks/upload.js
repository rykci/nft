const { task } = require('hardhat/config')
const { create } = require('ipfs-http-client')
const fs = require('fs').promises

task('upload', 'Upload directory to IPFS')
  .addParam('dir', 'The path of the directory to upload')
  .setAction(async (taskArgs) => {
    // reate an instance of the HTTP API client
    const ipfs = create('/ip4/192.168.88.41/tcp/5001')

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

    const fileMetadata = fileData.map((file, i) => {
      return {
        path: `${i + 1}.json`,
        content: JSON.stringify({
          name: file.path.split('.')[0],
          image: `http://192.168.88.41:5050/ipfs/${file.cid}`,
        }),
      }
    })

    const metadata = await uploadToIPFS(ipfs, fileMetadata)

    console.log(metadata.pop())
  })

const uploadToIPFS = async (ipfs, files) => {
  let fileData = []

  // uploads each file and wraps with a directory
  for await (const file of ipfs.addAll(files, {
    wrapWithDirectory: true,
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
