const lockTokens = async (cid, payer, amount, fileSize) => {
  require('dotenv').config
  const erc20ABI = require('../../abi/ERC20.json')
  const swanPaymentABI = require('../../abi/SwanPayment.json')

  const one = '1000000000000000000'
  const ten = '10000000000000000000'
  const oneHundred = '100000000000000000000'
  const oneThousand = '1000000000000000000000'

  const overrides = {
    gasLimit: 9999999,
  }

  const usdcAddress = process.env.USDC_ADDRESS
  const recipientAddress = process.env.RECIPIENT_ADDRESS
  const gatewayContractAddress = process.env.SWAN_PAYMENT_ADDRESS

  const USDCInstance = new ethers.Contract(usdcAddress, erc20ABI)
  await USDCInstance.connect(payer).approve(gatewayContractAddress, oneThousand)

  const paymentInstance = new ethers.Contract(
    gatewayContractAddress,
    swanPaymentABI,
  )

  const tx = await paymentInstance.connect(payer).lockTokenPayment(
    {
      id: cid,
      minPayment: amount,
      amount: (parseInt(amount) * 3).toString(),
      lockTime: 86400 * 6, // 6 days
      recipient: recipientAddress, //todo:
      size: fileSize,
      storage_copy: 5,
    },
    overrides,
  )

  await tx.wait()

  return tx.hash
}

module.exports = { lockTokens }
