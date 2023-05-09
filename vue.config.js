const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
})

module.exports = ({
  devServer:{
    proxy: process.env.VUE_APP_API_URL_PROXY
    ? process.env.VUE_APP_API_URL_PROXY
    : null
  }
})