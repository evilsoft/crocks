const test = require('tape')

const i_comb  = require('./i_comb')

test('i_comb (I combinator)', t => {
  const x = 'somehting'

  t.equal(typeof i_comb, 'function', 'is a function')
  t.equal(i_comb(x), x, 'returns the passed argument')

  t.end()
})
