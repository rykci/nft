require('@nomiclabs/hardhat-waffle')
require('@openzeppelin/hardhat-upgrades')
require('dotenv').config()

require('./tasks/tokenURI')
require('./tasks/uploadMint')
require('./tasks/upload')
require('./tasks/mint')
require('./tasks/deploy')

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.4',
  defaultNetwork: 'mumbai',
  networks: {
    mumbai: {
      url: process.env.MUMBAI_URL,
      accounts: [process.env.PRIVATE_KEY],
      contract: '0x1A1e5AC88C493e0608C84c60b7bb5f04D9cF50B3',
      mcs_api: process.env.MCS_API,
      openseaUrl: `https://testnets.opensea.io/assets/`,
      RECIPIENT_ADDRESS: '0xABeAAb124e6b52afFF504DB71bbF08D0A768D053',
      USDC_ADDRESS: '0xe11A86849d99F524cAC3E7A0Ec1241828e332C62',
      SWAN_PAYMENT_ADDRESS: '0x12EDC75CE16d778Dc450960d5f1a744477ee49a0',
    },
  },
}
