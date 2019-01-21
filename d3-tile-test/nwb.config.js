module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: false
  },
  babel: {
    plugins: 'transform-flow-strip-types'
  },
  devServer: {
    proxy: {
      '/stweb-dr': 'http://localhost:7080',
      '/schematica': 'http://localhost:7080'
    }
  }
}
