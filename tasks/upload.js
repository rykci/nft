const { task } = require('hardhat/config')
const { create } = require('ipfs-http-client')
const fs = require('fs').promises

require('dotenv').config()

task('upload', 'Upload directory to IPFS')
  .addParam('file', 'The path of the file you wish to upload to IPFS')
  .addOptionalParam('name', 'name of the NFT')
  .addOptionalParam('desc', 'NFT description')
  .setAction(async (taskArgs) => {
    // create an instance of the HTTP API client
    const ipfs = create(process.env.WRITE_GATEWAY)

    let path = taskArgs.file

    // fileName is the name of the .car file
    const fileName = path.split('/').pop()

    // file object for IPFS api
    const file = {
      path: fileName, //get path name
      content: await fs.readFile(path), //.car file
    }

    // upload to IPFS and return object with size and CID
    const uploadResult = await ipfs.add(file, { wrapWithDirectory: true })
    console.log(uploadResult)

    // the name of the .car file without the .car extension
    const metadataName = fileName.split('.')[0]

    // metadata file object for IPFS api
    const fileMetadata = {
      path: `${metadataName}.json`, // add JSON extension
      content: JSON.stringify({
        name: taskArgs.name || metadataName, // directory name
        description: taskArgs.desc,
        //image: `${process.env.READ_GATEWAY}QmQbF9mJEYUdLaWgw568abFiwvR1udQsfmuLyhejTiZ2DG`, // placeholder database icon for opensea
        data: `${process.env.READ_GATEWAY}${uploadResult.cid}`, // gateway to files of directory on IPFS
        attributes: [
          // display the size on OpenSea
          {
            display_type: 'number',
            trait_type: 'Size',
            value: uploadResult.size,
          },
        ],
      }),
    }

    // upload to IPFS and return object with size and CID
    console.log(await ipfs.add(fileMetadata))
  })
