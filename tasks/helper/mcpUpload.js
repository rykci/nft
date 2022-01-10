const mcpUpload = async (fileName, file, wallet_address, duration = 180) => {
  const axios = require('axios')
  const FormData = require('form-data')

  const form = new FormData()
  form.append('duration', duration)
  form.append('file', file, fileName)
  form.append('wallet_address', wallet_address)

  try {
    const response = await axios.post(network.config.mcp.uploadUrl, form, {
      headers: {
        ...form.getHeaders(),
      },
    })
    return response.data
  } catch (err) {
    // Handle Error Here
    console.error(err)
  }
}

module.exports = { mcpUpload }
