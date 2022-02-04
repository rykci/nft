require('@nomiclabs/hardhat-waffle')
require('dotenv').config()

require('./tasks/tokenURI')
require('./tasks/uploadLockMint')

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
      contract: '',
      mcp_api: process.env.MCP_API,
    },
  },
}
