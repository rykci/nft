const { task } = require('hardhat/config')
const axios = require('axios')

task('login', 'Login to MCP').setAction(async () => {
  const mcp = network.config.mcp

  await axios
    .post(mcp.loginUrl, {
      email: mcp.email,
      password: mcp.password,
    })
    .then(
      (response) => {
        console.log(response.data)
      },
      (error) => {
        console.log(error)
      },
    )
})
