const mcpUpload = async (
  fileName,
  file,
  wallet_address,
  duration = 180,
  file_type = '0',
) => {
  const axios = require('axios')
  const FormData = require('form-data')

  const form = new FormData()
  form.append('duration', duration)
  form.append('file', file, fileName)
  form.append('wallet_address', wallet_address)
  form.append('file_type', file_type)

  try {
    const response = await axios.post(
      `${network.config.mcp_api}/storage/ipfs/upload`,
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
      },
    )
    return response.data
  } catch (err) {
    // Handle Error Here
    console.error(err)
  }
}

module.exports = { mcpUpload }
