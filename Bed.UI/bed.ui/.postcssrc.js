// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    // to edit target browsers: use "browserlist" field in package.json
    "autoprefixer": {}
  },devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8888, // CHANGE YOUR PORT HERE!
    https: false,
    hotOnly: false,
  },
}
