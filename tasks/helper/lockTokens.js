const lockTokens = async (cid, payer, amount, fileSize, source_file_id) => {
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

  const usdcAddress = network.config.USDC_ADDRESS
  const recipientAddress = network.config.RECIPIENT_ADDRESS
  const gatewayContractAddress = network.config.SWAN_PAYMENT_ADDRESS

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
      amount: (amount * 3).toString(),
      lockTime: 86400 * 6, // 6 days
      recipient: recipientAddress, //todo:
      size: fileSize,
      copyLimit: 1,
    },
    overrides,
  )

  await tx.wait()

  // write lockpayment result to db
  try {
    const lockParam = {
      tx_hash: tx.hash,
      payload_cid: uploadResponse.data.payload_cid,
      min_payment: amount.toString(),
      contract_address: network.config.SWAN_PAYMENT_ADDRESS,
      address_from: payer.address,
      address_to: network.config.SWAN_PAYMENT_ADDRESS,
      lock_payment_time: new Date().getTime(),
      source_file_id: source_file_id,
    }

    console.log(lockParam)

    const res = await axios.post(
      `${network.config.mcs_api}/billing/deal/lockpayment`,
      lockParam,
    )
  } catch (err) {
    console.log('write lockpayment result to db error')
    console.log(err)
  }

  return tx.hash
}

module.exports = { lockTokens }
