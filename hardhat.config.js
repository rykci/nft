require('@nomiclabs/hardhat-waffle')
require('dotenv').config()

require('./tasks/upload')
require('./tasks/mint')
require('./tasks/tokenURI')
require('./tasks/pack')
require('./tasks/deploy')
//require('./tasks/dev')

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
      contract: '0x33317205b442C98C276B3F51EEbC84c6B2F8c9dF',
    },
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: [process.env.PRIVATE_KEY],
      contract: '0xa03ab8D39BBBfE6e9B47FA219B5D0663DB7D67Fa',
    },
  },
}
