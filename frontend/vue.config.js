const dotenv = require('dotenv-webpack');

module.exports = {
  configureWebpack: {
    plugins: [
      new dotenv()
    ]
  }
}