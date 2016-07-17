const isFunction  = require('./isFunction')

function isApply(m) {
  return !!m && isFunction(m.ap) && isFunction(m.map)
}

module.exports = isApply
