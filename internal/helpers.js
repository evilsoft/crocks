const isFunction  = fn => typeof fn === 'function'
const argsArray   = x => Array.prototype.slice.call(x)

module.exports = {
  isFunction,
  argsArray
}
