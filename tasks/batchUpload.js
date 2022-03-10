const { task } = require('hardhat/config')

const axios = require('axios')
const fs = require('fs').promises
const FormData = require('form-data')

const csv = require('csvtojson')

const uploadPromise = (
  fileName,
  file,
  wallet_address,
  duration = 180,
  file_type = '0',
) => {
  const form = new FormData()
  form.append('duration', duration)
  form.append('file', file, fileName)
  form.append('wallet_address', wallet_address)
  form.append('file_type', file_type)

  const res = axios.post(
    `${network.config.mcs_api}/storage/ipfs/upload`,
    form,
    {
      headers: {
        ...form.getHeaders(),
      },
    },
  )

  return res
}

task('batchUpload', 'upload files from csv file to MCS')
  .addParam('file', 'The path of the csv file')
  .setAction(async ({ file }) => {
    const signer = await ethers.getSigner() // get signer for wallet address
    let csvArray = await csv().fromFile(file) // read csv
    // read file from filePath in csv
    csvArray = await Promise.all(
      csvArray.map(async (row) => ({
        ...row,
        file: await fs.readFile(row.filePath),
      })),
    )

    // send post request for each row
    const requests = csvArray.map((row) =>
      uploadPromise(row.fileName, row.file, signer.address).then(
        (res) => res.data,
      ),
    )

    try {
      const result = await Promise.all(requests) // wait for all uploads
      console.log(result)
    } catch (err) {
      console.log(err.response.data)
    }
  })
