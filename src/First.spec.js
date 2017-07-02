const test = require('tape')

const isFunction = require('./core/isFunction')
const First = require('./First')

test('First crock', t => {
  t.ok(isFunction(First), 'is a function')
  t.end()
})
