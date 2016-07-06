const isFunction  = fn => typeof fn === 'function'
const argsArray   = x => Array.prototype.slice.call(x)

function isSameType(o, m) {
  return isFunction(o.type)
    && isFunction(m.type)
    && o.type() === m.type()
}

module.exports = {
  isFunction,
  argsArray,
  isSameType
}
