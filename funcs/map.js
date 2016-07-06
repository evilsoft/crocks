const curry = require('./curry')

const helpers     = require('../internal/helpers')
const isFunction  = helpers.isFunction

function _map(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError('first arg to map must be a function')
  }

  if(isFunction(m)) {
    return x => fn(m(x))
  } else if(m && isFunction(m.map)) {
    return m.map(fn)
  } else {
    throw new TypeError('second arg to map must be Functor or function')
  }
}

module.exports = curry(_map)
