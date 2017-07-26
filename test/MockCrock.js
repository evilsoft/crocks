const constant = require('../src/core/constant')
const isSameType = require('../src/core/isSameType')
const _implements = require('../src/core/implements')

const _type = constant('MockCrock')
const _of   = x => MockCrock(x)

function MockCrock(x) {
  const value     = constant(x)
  const map       = fn => MockCrock(fn(x))
  const type      = _type
  const ap        = m => m.map(x)
  const chain     = fn => fn(x)
  const of        = _of
  const sequence  = () => x.map(MockCrock)
  const traverse  = (_, f) => f(x).map(MockCrock)
  const equals =
    m => isSameType(MockCrock, m)
      && m.value() === x

  return {
    value, type, map, ap,
    chain, of, sequence,
    traverse, equals
  }
}

MockCrock.type  = _type
MockCrock.of    = _of

MockCrock['@@implements'] = _implements(
  [ 'ap', 'chain', 'equals', 'map', 'of', 'traverse' ]
)

module.exports = MockCrock
