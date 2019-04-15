module.exports = {
  devServer: {
    proxy: {
      '^/dec/': {
        target: 'http://123.56.156.144:3000/mock/292/',
        // ws: true,
        // changeOrigin: true
      },
      '^/bdc-mgt/': {
        target: 'http://47.93.86.110:9531/',
        // ws: true,
        // changeOrigin: true
      },
    }
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      },
    }
  }
}