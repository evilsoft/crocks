const isFunction = require('./isFunction')

function isType(type, m) {
  return isFunction(m.type) && type === m.type()
}

module.exports = isType
