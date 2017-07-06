const test = require('tape')

const isFunction = require('./isFunction')

test('isFunction predicate', t => {
  t.equal((typeof isFunction), 'function', 'is a function')
  t.end()
})
