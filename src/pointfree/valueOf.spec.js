const test = require('tape')
const sinon = require('sinon')

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const constant = x => () => x

const valueOf = require('./valueOf')

test('valueOf pointfree', t => {
  const f = valueOf
  const x = 'result'
  const m = { valueOf: sinon.spy(constant(x)) }

  t.ok(isFunction(valueOf), 'is a function')

  t.equals(f(undefined), undefined, 'returns undefined for undefined')
  t.equals(f(null), null, 'returns null for null')
  t.equals(f('string'), 'string', 'returns the string for string')
  t.equals(f(false), false, 'returns the boolean for boolean')
  t.same(f([]), [], 'returns the array for array')
  t.same(f({}), {}, 'returns the object for object')
  t.equals(f(unit), unit, 'returns the function for function')

  const result = valueOf(m)

  t.ok(m.valueOf.called, 'calls value on the passed container')
  t.equal(result, x, 'returns the result of calling m.valueOf')

  t.end()
})
