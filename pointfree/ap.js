const curry = require('../funcs/curry')

const helpers     = require('../internal/helpers')
const isFunction  = helpers.isFunction

// ap :: Applicative m => m a -> m (a -> b) ->  m b
function ap(m, x) {
  if(!isFunction(m.ap) || !isFunction(x.ap)) {
    throw new TypeError('Both args to ap must be Applicatives')
  }

  return x.ap(m)
}

module.exports = curry(ap)
