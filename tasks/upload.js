const { task } = require('hardhat/config')
const { create } = require('ipfs-http-client')
const fs = require('fs').promises

require('dotenv').config()

task('upload', 'Upload directory to IPFS')
  .addParam('car', 'The path of the .car file you wish to upload to IPFS')
  .addOptionalParam('name', 'name of the NFT')
  .addOptionalParam('desc', 'NFT description')
  .setAction(async (taskArgs) => {
    // create an instance of the HTTP API client
    const ipfs = create(process.env.WRITE_GATEWAY)

    let path = taskArgs.car

    const fileName = path.split('/').pop()

    const file = {
      path: fileName, //get path name
      content: await fs.readFile(path),
    }

    const uploadResult = await ipfs.add(file, { wrapWithDirectory: true })
    console.log(uploadResult)

    const metadataName = fileName.split('.')[0]
    const fileMetadata = {
      path: `${metadataName}.json`,
      content: JSON.stringify({
        name: taskArgs.name || metadataName, // directory name
        description: taskArgs.desc,
        //image: `${process.env.READ_GATEWAY}QmQbF9mJEYUdLaWgw568abFiwvR1udQsfmuLyhejTiZ2DG`, // placeholder database icon for opensea
        data: `${process.env.READ_GATEWAY}${uploadResult.cid}`, // gateway to files of directory on IPFS
        attributes: [
          {
            display_type: 'number',
            trait_type: 'Size',
            value: uploadResult.size,
          },
        ],
      }),
    }

    console.log(await ipfs.add(fileMetadata))
  })
