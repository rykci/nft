const getAverageFilecoinStoragePrice = async () => {
  require('dotenv').config
  const axios = require('axios')

  try {
    const response = await axios.get(`${process.env.FILSWAN_API}/stats/storage`)
    return response.data?.data?.average_price_per_GB_per_year?.split(' ')[0]
  } catch (err) {
    // Handle Error Here
    console.error(err)
  }
}

const getAverageStoragePricePerByte = async () => {
  const axios = require('axios')

  try {
    const avgFilecoinStoragePrice = await getAverageFilecoinStoragePrice()

    const conversionResponse = await axios.get(
      `${network.config.mcs_api}/billing/price/filecoin`,
    )
    const usdcPerFilecoin = conversionResponse?.data?.data

    return avgFilecoinStoragePrice * usdcPerFilecoin * 1.074 * 10 ** 9 // USDC price per byte
  } catch (err) {
    // Handle Error Here
    console.error(err)
  }
}

module.exports = { getAverageStoragePricePerByte }
