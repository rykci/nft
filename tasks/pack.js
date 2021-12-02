const { packToFs } = require('ipfs-car/pack/fs')

const fs = require('fs').promises
const { FsBlockStore } = require('ipfs-car/blockstore/fs')
const { task } = require('hardhat/config')
require('dotenv').config()

task('pack', 'converts file or directory to .car file')
  .addParam('dir', 'the path to the directory')
  .addOptionalParam('out', 'the output path for the .car file')
  .setAction(async (taskArgs) => {
    const fileName = taskArgs.dir.split('/').pop()
    const outputPath = taskArgs.out

    await packToFs({
      input: taskArgs.dir,
      // output to path in config, or to same location at input
      output: outputPath
        ? `${outputPath}/${fileName}.car`
        : `${taskArgs.dir}/../${fileName}.car`,
      blockstore: new FsBlockStore(),
    })

    // logs the upload command that the user can copy and paste to upload the car file to IPFS
    console.log(`.car file made: ${fileName}.car`)
  })
