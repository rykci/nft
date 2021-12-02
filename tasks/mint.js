const { task } = require('hardhat/config')
const { mint } = require('./helper/mint.js')
require('dotenv').config()

task('mint', 'mint NFT supplying contract and tokenURI')
  .addParam('cid', 'IPFS cid of the NFT metadata')
  .setAction(async (taskArgs) => {
    await mint(taskArgs.cid)
  })
