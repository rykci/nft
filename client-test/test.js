const { mcsClient } = require('mcs-client')
const fs = require('fs').promises

const test = async () => {
  const mcs = new mcsClient({
    privateKey: '<PRIVATE_KEY>',
    rpcUrl: 'https://polygon-mumbai.g.alchemy.com/v2/<API_KEY>',
  })

  const filesArray = [
    { fileName: 'Filswan Logo', file: await fs.readFile('./filswan.jpeg') },
  ]
  console.log('VERSION: ', mcs.version)

  console.log('UPLOADING...')
  const uploadRes = await mcs.upload(filesArray)
  console.log(uploadRes)

  const responseData = uploadRes[0].data // use the first file as example

  if (responseData.need_pay == 0 || responseData.need_pay == 2) {
    // make payment
    console.log('LOCKING TOKENS')
    const tx = await mcs.makePayment(responseData.payload_cid, '5')
    console.log(tx.transactionHash)
  }

  /*
  console.log('CHECK STATUS')
  const tx2 = await mcs.checkStatus(testResponse.payload_cid)
  console.log(tx2)

  console.log('MINTING NFT...')
  const tx3 = await mcs.mintAsset(testResponse.payload_cid, {
    name: 'test',
    image: testResponse.ipfs_url,
  })
  console.log(tx3)

  console.log('LISTING UPLOADS')
  console.log(await mcs.listUploads())
  */
}

test()
