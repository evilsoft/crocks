const test = require('tape')

const isFunction = require('./core/isFunction')
const Either = require('./Either')

test('Either crock', t => {
  t.ok(isFunction(Either), 'is a function')
  t.end()
})
