const identity = require('../combinators/identity')
const constant = require('../combinators/constant')
const _inspect = require('../helpers/inspect')

const _type = constant('Last')

function LastMonoid(x) {
  return {
    inspect: constant('Last' + _inspect(x)),
    concat: identity,
    value:  constant(x),
    type:   _type
  }
}

LastMonoid.empty = () => LastMonoid(null)
LastMonoid.type = _type

module.exports = LastMonoid
