const { task } = require('hardhat/config')
const {
  getAverageUsdcStoragePrice,
} = require('./helper/getAverageUsdcStoragePrice')

task('price', 'get the price estimate to store file')
  .addParam('size', 'byte size of file')
  .setAction(async ({ size }) => {
    const usdcPricePerByte = await getAverageUsdcStoragePrice()
    const lockAmount = (usdcPricePerByte * size).toString()

    console.log(lockAmount)
  })
