import _implements from '../core/implements'
import _inspect from '../core/inspect'

const constant = x => () => x
const identity = x => x

const typeString = 'crocks/Last@1'
const _type = constant('Last')

export default function LastMonoid(x) {
  return {
    inspect: constant('Last' + _inspect(x)),
    concat: identity,
    valueOf: constant(x),
    type: _type,
    ['@@type']: typeString
  }
}

LastMonoid.empty = () => LastMonoid(null)
LastMonoid.type = _type
LastMonoid['@@type'] = typeString

LastMonoid['@@implements'] = _implements(
  [ 'concat', 'empty' ]
)
