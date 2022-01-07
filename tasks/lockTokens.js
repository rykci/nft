const { task } = require('hardhat/config')

const { lockTokenPayment } = require('./helper/lockTokenPayment')

task('lockTokens', 'make payment for file by locking tokens')
  .addParam('cid', 'payload_cid of the file')
  .addParam('amount', 'amount of tokens to lock')
  .setAction(async ({ cid, amount }) => {
    const payer = await ethers.getSigner()

    const txHash = await lockTokenPayment(cid, payer, amount)

    console.log(txHash)
  })
