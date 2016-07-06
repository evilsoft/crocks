const curry = require('./curry')

const helpers     = require('../internal/helpers')
const isFunction  = helpers.isFunction
const isSameType  = helpers.isSameType

function _ap(o, m) {
  if(!isFunction(o.ap)) {
    throw new TypeError('First arg to ap must be an Applicative')
  }

  if(!isSameType(o, m)) {
    throw new TypeError('Both args must be Applicatives of the same type')
  }
}

module.exports = curry(_ap)
