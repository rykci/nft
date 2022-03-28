const mcsUpload = async (
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

  console.log('Uploading file to MCS...')
  try {
    const startTime = new Date().getTime()
    const response = await axios
      .post(`${network.config.mcs_api}/storage/ipfs/upload`, form, {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {
          ...form.getHeaders(),
        },
      })
      .then((res) => {
        console.log(
          `Upload ${file_type == 1 ? 'Metadata' : ''} Time: ${
            new Date().getTime() - startTime
          } ms`,
        )
        return res
      })
    return response.data
  } catch (err) {
    // Handle Error Here
    console.error(err)
  }
}

module.exports = { mcsUpload }
