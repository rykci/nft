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

    /* create array of objects for each file in directory
     * path: the file name
     * content: use readFile to get content
     */
    const files = await Promise.all(
      dir.map(async (file) => {
        return {
          path: file,
          content: await fs.readFile(`${taskArgs.dir}/${file}`),
        }
      }),
    )

    // uploads each file and wraps with a directory
    for await (const file of ipfs.addAll(files, {
      wrapWithDirectory: true,
    })) {
      console.log(file)
    }
  })
