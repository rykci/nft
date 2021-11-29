const { task } = require('hardhat/config')
const { zip } = require('zip-a-folder')

task('zip', 'creates a zip file for a directory')
  .addParam('dir', 'directory you wish to zip')
  .setAction(async (taskArgs) => {
    await zip(
      taskArgs.dir,
      `${taskArgs.dir}/../${taskArgs.dir.split('/').pop()}.zip`,
    )

    // logs the upload command that the user can copy and paste to upload the car file to IPFS
    console.log(`.zip file made: ${taskArgs.dir.split('/').pop()}.zip`)
  })
