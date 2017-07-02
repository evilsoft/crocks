const test = require('tape')

const isFunction = require('./core/isFunction')
const Unit = require('./Unit')

test('Unit crock', t => {
  t.ok(isFunction(Unit), 'is a function')
  t.end()
})
