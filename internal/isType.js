const isFunction = require('./isFunction')

// isType :: Container m => String -> m -> String
function isType(type, m) {
  return isFunction(m.type) && type === m.type()
}

module.exports = isType
