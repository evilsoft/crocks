import _implements from '../core/implements'
import _inspect from '../core/inspect'

const constant = x => () => x
const identity = x => x

const typeString = 'crocks/Last@1'
export const type = constant('Last')

export default function LastMonoid(x) {
  return {
    inspect: constant('Last' + _inspect(x)),
    concat: identity,
    valueOf: constant(x),
    type,
    ['@@type']: typeString
  }
}

LastMonoid.empty = () => LastMonoid(null)
LastMonoid.type = type
LastMonoid['@@type'] = typeString

LastMonoid['@@implements'] = _implements(
  [ 'concat', 'empty' ]
)
