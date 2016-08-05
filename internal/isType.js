const isFunction = require('./isFunction')

// isType :: Container m => String -> m -> Boolean
function isType(type, m) {
  return isFunction(m.type) && type === m.type()
}

module.exports = isType
