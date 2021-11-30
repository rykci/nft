const { task } = require('hardhat/config')
const axios = require('axios')

task('login', 'Login to MCP').setAction(async () => {
  const mcp = network.config.mcp

  try {
    const response = await axios.post(mcp.loginUrl, {
      email: mcp.email,
      password: mcp.password,
    })

    console.log(response.data)
  } catch (err) {
    console.log(err)
  }
})
