const paymentInfo = async (payload_cid) => {
  const axios = require('axios')

  try {
    const res = await axios.get(
      `${network.config.mcp_url}/billing/deal/lockpayment/info?payload_cid=${payload_cid}`,
    )
    return res?.data?.data
  } catch (err) {
    // Handle Error Here
    console.error(err)
  }
}

module.exports = { paymentInfo }
