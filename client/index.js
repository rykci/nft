const packageJson = require('./package.json')
const Web3 = require('web3')

const { mcsUpload } = require('./helper/upload')
const { lockToken } = require('./helper/lockToken')
const { getFileStatus, getDealList } = require('./helper/mcsApi')
const { mint } = require('./helper/mint')

class mcsClient {
  /**
   * Constructs a client bound to the user and endpoint.
   *
   * @example
   * ```js
   * const { mcsClient } = require('mcs-client')
   * const client = new mcsClient({
   *   privateKey: PRIVATE_KEY
   *   rpcURL: 'https://matic-mumbai.chainstacklabs.com'
   * })
   * ```
   * @param {{privateKey: string, rpcUrl: string}} options
   */
  constructor({
    privateKey,
    rpcUrl = 'https://matic-mumbai.chainstacklabs.com',
  }) {
    this.web3 = new Web3(rpcUrl)
    this.web3.eth.accounts.wallet.add(privateKey)
    this.publicKey = this.web3.eth.accounts.privateKeyToAccount(
      privateKey,
    ).address
    this.privateKey = privateKey
    this.version = packageJson.version
  }

  /**
   * Uploads file(s) using MCS upload API
   * files is array of objects
   * {
   *    fileName: String
   *    file: File
   * }
   * options include
   * {
   *    delay: staggers API calls for multiple files, default is 1000 ms
   *    duration: duration of file on MCS, default is 525
   *    fileType: set 1 for metadata files, default is 0
   * }
   *
   * @param {[fileName: string, file: File]} files
   * @param {{delay: number, duration: number, fileType: number}} options
   * @returns Array of upload API responses
   */
  upload = async (files, options) =>
    await mcsUpload(this.publicKey, files, options)

  /**
   * Makes payment for unpaid files on MCS.
   *
   * @param {string} payloadCid
   * @param {number} amount
   * @returns payment transaction response
   */
  makePayment = async (payloadCid, amount) =>
    await lockToken(this.web3, this.publicKey, payloadCid, amount)

  /**
   *
   * @param {string} payloadCid
   * @returns file status on MCS
   */
  checkStatus = async (payloadCid) => await getFileStatus(payloadCid)

  /**
   * Mints file as NFT availiable to view on Opensea
   * @param {string} cid
   * @param {{name: string, description: string, image: URL, tx_hash: string}} nft
   * @returns mint info reponse object
   */
  mintAsset = async (cid, nft) =>
    await mint(this.web3, this.publicKey, cid, nft)

  /**
   * List the user's uploaded files on MCS
   * @returns API list reponse
   */
  listUploads = async (pageNumber = 1) =>
    await getDealList(this.publicKey, pageNumber)
}

module.exports = { mcsClient }
