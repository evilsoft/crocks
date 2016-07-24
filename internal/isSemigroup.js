const isFunction  = require('./isFunction')
const isString    = require('./isString')

function isSemigroup(m) {
  return isString(m) || (!!m && isFunction(m.concat))
}

module.exports = isSemigroup
