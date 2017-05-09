const test = require('tape')
const sinon = require('sinon')

const curryN = require('./curryN')

test('curryN function functionality', t => {
  const result = 'result'
  const f = sinon.spy(() => result)
  const curried = curryN(3, f)

  t.equal(curried(2, 3, 1), result, 'returns the result when fully applied')
  t.equal(curried(2)(3)(1), result, 'returns the result when curried')
  t.equal(curried(1, 2)(3), result, 'returns the result when called (_, _)(_)')
  t.equal(curried(1)(2, 3), result, 'returns the result when called (_)(_, _)')

  curried(1, 2, 3, 4, 5)
  t.equal(f.lastCall.args.length, 3, 'only applies N arguments')

  t.equal(curried()()(), result, 'returns the result when curried with no args')
  t.same(f.lastCall.args, [ undefined, undefined, undefined ], 'applies undefineds when curried with no args')

  t.end()
})

test('curry0 called with arguments', t => {
  const f = sinon.spy(() => 'string')
  const curried = curryN(0, f)

  t.equal(curried(1, 2, 3), 'string', 'returns the result')
  t.equal(f.lastCall.args.length, 0, 'does not pass arguments to function')
  t.end()
})

test('curry0 called with no arguments', t => {
  const f = sinon.spy(() => 'string')
  const curried = curryN(0, f)

  t.equal(curried(), 'string', 'returns the result')
  t.end()
})
