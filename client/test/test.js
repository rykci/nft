const { mcsClient } = require('../index')

const test = async () => {
  const mcs = new mcsClient({
    privateKey: '<PRIVATE_KEY>',
    rpcUrl: 'https://polygon-mumbai.g.alchemy.com/v2/<API_KEY>',
  })

  const filesArray = [
    { fileName: 'test_file', file: JSON.stringify({ data: 'test content' }) },
  ]
  console.log('VERSION: ', mcs.version)

  console.log('UPLOADING...')
  const uploadRes = await mcs.upload(filesArray)
  console.log(uploadRes)

  const testResponse = uploadRes.pop().data

  console.log('LOCKING TOKENS')
  const tx = await mcs.makePayment(testResponse.payload_cid, '10')
  console.log(tx.transactionHash)

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
}

test()
