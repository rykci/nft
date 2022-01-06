const filecoinToUsdc = async (filecoin) => {
  const axios = require('axios')

  try {
    const res = await axios.get(network.config.mcp.filecoinUrl)
    const usdcPerFilecoin = res?.data?.data
    return usdcPerFilecoin * filecoin
  } catch (err) {
    // Handle Error Here
    console.error(err)
  }
}

module.exports = { filecoinToUsdc }
