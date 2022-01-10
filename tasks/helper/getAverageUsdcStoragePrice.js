const getAverageFilecoinStoragePrice = async () => {
  const axios = require('axios')

  try {
    const response = await axios.get(network.config.storageStatsUrl)
    return response.data?.data?.average_price_per_GB_per_year?.split(' ')[0]
  } catch (err) {
    // Handle Error Here
    console.error(err)
  }
}

const getAverageUsdcStoragePrice = async () => {
  const axios = require('axios')

  try {
    const avgFilecoinStoragePrice = await getAverageFilecoinStoragePrice()

    const conversionResponse = await axios.get(network.config.mcp.filecoinUrl)
    const usdcPerFilecoin = conversionResponse?.data?.data

    return avgFilecoinStoragePrice * usdcPerFilecoin * 10 ** 9 // USDC price per byte
  } catch (err) {
    // Handle Error Here
    console.error(err)
  }
}

module.exports = { getAverageUsdcStoragePrice }
