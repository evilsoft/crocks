const test = require('tape')

const isFunction = require('./isFunction')
const constant = require('./constant')
const unit = require('./unit')

const inspect = require('./inspect')

test('inspect internal function', t => {
  const m = { inspect: constant('inspect') }

  t.ok(isFunction(inspect), 'is a function')

  t.equal(inspect(m), ' inspect', 'calls inspect on containers')
  t.equal(inspect(unit), ' Function', 'outputs as a function')
  t.equal(inspect({ obj: true }), ' {}', 'outputs as an object')
  t.equal(inspect([]), ' [ ]', 'outputs as an array')
  t.equal(inspect([ 1, 2 ]), ' [ 1, 2 ]', 'outputs as an array')
  t.equal(inspect(0), ' 0', 'outputs as a number')
  t.equal(inspect('string'), ' "string"', 'outputs as a string wrapped in quotes')
  t.equal(inspect(true), ' true', 'outputs as a boolean')

  t.end()
})
