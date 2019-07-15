const test = require('tape')

const isFunction = require('../core/isFunction')
const index = require('.')
const Pred = require('../core/Pred')

test('Pred crock', t => {
  t.ok(isFunction(index), 'is a function')

  t.equals(Pred, index, 'provides the expected Pred')

  t.end()
})
