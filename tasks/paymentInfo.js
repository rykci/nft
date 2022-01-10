const { task } = require('hardhat/config')
const { paymentInfo } = require('./helper/paymentInfo')

task('paymentInfo', 'get the payment status of file')
  .addParam('cid', 'payload cid of file')
  .setAction(async ({ cid }) => {
    const info = await paymentInfo(cid)

    console.log(info)
  })
