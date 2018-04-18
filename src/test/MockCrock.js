import _implements from '../core/implements.js'
import _equals from '../core/equals.js'

const constant = x => () => x

const _type = constant('MockCrock')
const typeString = 'crocks/MockCrock@1'
const _of   = x => MockCrock(x)

function MockCrock(x) {
  const valueOf     = constant(x)
  const map       = fn => MockCrock(fn(x))
  const type      = _type
  const ap        = m => m.map(x)
  const chain     = fn => fn(x)
  const of        = _of
  const sequence  = () => x.map(MockCrock)
  const traverse  = (_, f) => f(x).map(MockCrock)
  const equals =
    m => _equals(m.valueOf(), x)

  return {
    valueOf, type, map, ap,
    chain, of, sequence,
    ['@@type']: typeString,
    traverse, equals
  }
}

MockCrock.of = _of
MockCrock.type = _type
MockCrock['@@type'] = typeString

MockCrock['@@implements'] = _implements(
  [ 'ap', 'chain', 'equals', 'map', 'of', 'traverse' ]
)

export default MockCrock
