const config = require('./config.cjs').database

module.exports = {
  development: { ...config },
  staging: { ...config },
  production: { ...config }
}
