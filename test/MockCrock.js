const constant = require('../combinators/constant')

const _type = constant('MockCrock')
const _of   = x => MockCrock(x)

function MockCrock(x) {
  const value     = constant(x)
  const map       = fn => MockCrock(fn(x))
  const type      = _type
  const ap        = m => m.map(x)
  const chain     = fn => fn(x)
  const of        = _of
  const sequence  = _ => x.map(MockCrock)
  const traverse  = (_, f) => f(x).map(MockCrock)

  return {
    value, type, map, ap,
    chain, of, sequence,
    traverse
  }
}

MockCrock.type  = _type
MockCrock.of    = _of

module.exports = MockCrock
