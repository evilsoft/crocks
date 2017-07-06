const test = require('tape')

const isFunction = require('./core/isFunction')
const Last = require('./Last')

test('Last crock', t => {
  t.ok(isFunction(Last), 'is a function')
  t.end()
})
