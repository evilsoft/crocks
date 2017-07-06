const _implements = require('../src/core/implements')
const _inspect = require('../src/core/inspect')
const constant = require('../src/core/constant')
const identity = require('../src/core/identity')

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

LastMonoid['@@implements'] = _implements(
  [ 'concat', 'empty' ]
)

module.exports = LastMonoid
