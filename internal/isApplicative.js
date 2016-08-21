const isFunction = require('./isFunction')

function isApplicative(m) {
  return !!m
    && isFunction(m.map)
    && isFunction(m.ap)
    && isFunction(m.of)
}

module.exports = isApplicative
