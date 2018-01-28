const _implements = require('../core/implements')
const _inspect = require('../core/inspect')

const constant = x => () => x
const identity = x => x

const typeFn = constant('crocks/Last@1')
const _type = constant('Last')

function LastMonoid(x) {
  return {
    inspect: constant('Last' + _inspect(x)),
    concat: identity,
    valueOf: constant(x),
    type: _type,
    '@@type': typeFn
  }
}

LastMonoid.empty = () => LastMonoid(null)
LastMonoid.type = _type
LastMonoid['@@type'] = typeFn

LastMonoid['@@implements'] = _implements(
  [ 'concat', 'empty' ]
)

module.exports = LastMonoid
