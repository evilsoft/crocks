const test = require('tape')

const Pred = require('../Pred')
const isFunction = require('./isFunction')

const safe = require('./safe')

test('safe core', t => {
  t.ok(isFunction(safe), 'is a function')
  t.end()
})

test('safe predicate function', t => {
  const pred = x => !!x

  const f = safe(pred)

  const fResult = f(false).option('nothing')
  const tResult = f('just').option('nothing')

  t.equals(fResult, 'nothing', 'returns a Nothing when false')
  t.equals(tResult, 'just', 'returns a Just when true')

  t.end()
})

test('safe Pred', t => {
  const pred = Pred(x => !!x)

  const f = safe(pred)

  const fResult = f(0).option('nothing')
  const tResult = f('just').option('nothing')

  t.equals(fResult, 'nothing', 'returns a Nothing when false')
  t.equals(tResult, 'just', 'returns a Just when true')

  t.end()
})
