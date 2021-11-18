const { packToFs } = require('ipfs-car/pack/fs')

const fs = require('fs').promises
const { FsBlockStore } = require('ipfs-car/blockstore/fs')
const { task } = require('hardhat/config')

task('pack', 'converts file or directory to .car file')
  .addParam('dir', 'the path to the directory')
  .setAction(async (taskArgs) => {
    await packToFs({
      input: taskArgs.dir,
      output: `${taskArgs.dir}/../${taskArgs.dir.split('/').pop()}.car`,
      blockstore: new FsBlockStore(),
    })

    // logs the upload command that the user can copy and paste to upload the car file to IPFS
    console.log(
      `npx hardhat upload --car ${taskArgs.dir}/../${taskArgs.dir
        .split('/')
        .pop()}.car`,
    )
  })
