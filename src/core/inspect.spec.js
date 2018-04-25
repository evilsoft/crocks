const test = require('tape')
const Mock = require('../test/MockCrock')
const isFunction = require('./isFunction')
const unit = require('./_unit')

const inspect = require('./inspect')

test('inspect internal function', t => {
  const m = Mock.of(42)

  t.ok(isFunction(inspect), 'is a function')

  t.equal(inspect(m), ' Mock 42', 'calls inspect on containers')
  t.equal(inspect(unit), ' Function', 'outputs as a function')
  t.equal(inspect([]), ' [ ]', 'outputs as an array')
  t.equal(inspect([ 1, 2 ]), ' [ 1, 2 ]', 'outputs as an array')
  t.equal(inspect(0), ' 0', 'outputs as a number')
  t.equal(inspect('string'), ' "string"', 'outputs as a string wrapped in quotes')
  t.equal(inspect(true), ' true', 'outputs as a boolean')
  t.equals(inspect({ a: 5 }), ' { a: 5 }', 'outputs object contents')
  t.equals(inspect({ a: 5, b: { c: '5' } }), ' { a: 5, b: { c: "5" } }', 'outputs object contents (nested)')
  t.equals(inspect({ a: m }), ' { a: Mock 42 }', 'calls inspect on properties which are containers')
  t.equals(inspect({ a: Mock.of({ b: m }) }), ' { a: Mock { b: Mock 42 } }', 'calls inspect on properties which are containers (nested)')

  t.end()
})
