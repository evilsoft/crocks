const isFunction  = require('./isFunction')
const isSemigroup = require('./isSemigroup')

// isMonoid :: a -> Boolean
function isMonoid(m) {
  return !!m
    && isFunction(m.empty)
}

module.exports = isMonoid
