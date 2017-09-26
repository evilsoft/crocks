const _implements = require('../core/implements')
const _inspect = require('../core/inspect')

const constant = x => () => x
const identity = x => x

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
