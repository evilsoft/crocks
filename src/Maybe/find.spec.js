const test = require('tape')

const isFunction = require('../core/isFunction')
const find = require('./find')

test('find', t => {
  t.ok(isFunction(find), 'is a function')

  t.end()
})
