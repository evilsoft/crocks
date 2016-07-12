const test = require('tape')

const identity = require('./identity')

test('identity (I combinator)', t => {
  const x = 'somehting'

  t.equal(typeof identity, 'function', 'is a function')
  t.equal(identity(x), x, 'returns the passed argument')

  t.end()
})
