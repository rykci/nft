require('@nomiclabs/hardhat-waffle')
require('dotenv').config()

require('./tasks/upload')
require('./tasks/mint')
require('./tasks/tokenURI')
require('./tasks/car')
require('./tasks/dev')

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
      contract: '0xA76fCe61D665F7F438a15A733adb725D61D0a009',
    },
    rinkeby: {
      url:
        'https://eth-rinkeby.alchemyapi.io/v2/JpRokS66sMaDD680W2NWwqhLuqDC1f7l',
      accounts: [process.env.PRIVATE_KEY],
      contract: '0xa03ab8D39BBBfE6e9B47FA219B5D0663DB7D67Fa',
    },
  },
}
