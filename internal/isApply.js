const isFunction  = require('./isFunction')

// isApply :: a -> Boolean
function isApply(m) {
  return !!m && isFunction(m.ap) && isFunction(m.map)
}

module.exports = isApply
