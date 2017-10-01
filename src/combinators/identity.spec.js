const test = require('tape')

const identity = require('./identity')
const isFunction = require('../core/isFunction')

test('identity (I combinator)', t => {
  const x = 'somehting'

  t.ok(isFunction(identity), 'is a function')
  t.equal(identity(x), x, 'returns the passed argument')

  t.end()
})
