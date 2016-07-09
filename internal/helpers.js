const isFunction  = fn => typeof fn === 'function'
const argsArray   = x => Array.prototype.slice.call(x)

function isType(type, m) {
  return isFunction(m.type) && type === m.type()
}

module.exports = {
  isFunction,
  argsArray,
  isType
}
