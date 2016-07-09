const test  = require('tape')

const helpers   = require('../test/helpers')
const bindFunc  = helpers.bindFunc
const noop      = helpers.noop

const k_comb = require('./k_comb')

test('k_comb (K combinator)', t => {
  const k = bindFunc(k_comb)
  const x = 3

  t.equal(typeof k_comb, 'function', 'is a function')

  t.equal(k_comb(x, 0), x, 'returns first parameter when second is a falsey number')
  t.equal(k_comb(x, 1), x, 'returns first parameter when second is a truthy number')
  t.equal(k_comb(x, ''), x, 'returns first parameter when second is a falsey string')
  t.equal(k_comb(x, 'string'), x, 'returns first parameter when second is a truthy string')
  t.equal(k_comb(x, false), x, 'returns first parameter when second is false')
  t.equal(k_comb(x, true), x, 'returns first parameter when second is true')
  t.equal(k_comb(x, []), x, 'returns first parameter when second is an array')
  t.equal(k_comb(x, {}), x, 'returns first parameter when second is an object')
  t.equal(k_comb(x, noop), x, 'returns first parameter when second is an object')

  t.end()
})
