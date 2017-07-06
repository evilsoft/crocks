const test = require('tape')

const isFunction = require('./core/isFunction')
const Pred = require('./Pred')

test('Pred crock', t => {
  t.ok(isFunction(Pred), 'is a function')
  t.end()
})
