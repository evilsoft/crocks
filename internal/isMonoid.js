const isFunction  = require('./isFunction')
const isSemigroup = require('./isSemigroup')

function isMonoid(m) {
  return !!m
    && isSemigroup(m)
    && isFunction(m.empty)
}

module.exports = isMonoid
