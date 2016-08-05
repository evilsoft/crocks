const isFunction  = require('./isFunction')
const isString    = require('./isString')

// isSemigroup :: a -> Boolean
function isSemigroup(m) {
  return isString(m) || (!!m && isFunction(m.concat))
}

module.exports = isSemigroup
