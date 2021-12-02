require('@nomiclabs/hardhat-waffle')
require('dotenv').config()

require('./tasks/upload')
require('./tasks/mint')
require('./tasks/tokenURI')
require('./tasks/pack')
require('./tasks/zip')
require('./tasks/deploy')
require('./tasks/login')
require('./tasks/mcp')

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
      mcp: {
        email: process.env.MCP_EMAIL,
        password: process.env.MCP_PASSWORD,
        authToken: process.env.MCP_AUTH_TOKEN,
        loginUrl: process.env.MCP_LOGIN_URL,
        uploadUrl: process.env.MCP_UPLOAD_URL,
      },
    },
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: [process.env.PRIVATE_KEY],
      contract: '',
      mcp: {
        email: process.env.MCP_EMAIL,
        password: process.env.MCP_PASSWORD,
        authToken: process.env.MCP_AUTH_TOKEN,
        loginUrl: process.env.MCP_LOGIN_URL,
        uploadUrl: process.env.MCP_UPLOAD_URL,
      },
    },
  },
}
