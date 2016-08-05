const isFunction  = require('../internal/isFunction')
const isObject    = require('../internal/isObject')
const isArray     = require('../internal/isArray')

function inspect(x) {
  if(x && isFunction(x.inspect)) {
    return ` ${x.inspect()}`
  }

  if(isFunction(x)) {
    return ' Function'
  }

  if(isObject(x)) {
    return ' {}'
  }

  if(isArray(x)) {
    return ' []'
  }

  return ` ${x}`
}

module.exports = inspect
