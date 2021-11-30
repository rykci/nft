const { task } = require('hardhat/config')
const { zip } = require('zip-a-folder')

task('zip', 'creates a zip file for a directory')
  .addParam('dir', 'directory you wish to zip')
  .addOptionalParam('out', 'the output path for the .zip file')
  .setAction(async (taskArgs) => {
    const fileName = taskArgs.dir.split('/').pop()
    const outputPath = taskArgs.out

    await zip(
      taskArgs.dir,
      outputPath
        ? `${outputPath}/${fileName}.zip`
        : `${taskArgs.dir}/../${fileName}.zip`,
    )

    // logs the upload command that the user can copy and paste to upload the car file to IPFS
    console.log(`.zip file made: ${fileName}.zip`)
  })
