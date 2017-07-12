const test = require('tape')

const isFunction = require('./isFunction')
const unit = require('./_unit')

const curry = require('./curry')

test('curry core', t => {
  t.ok(isFunction(curry), 'curry is a function')
  t.ok(isFunction(curry(unit)), 'returns a function')

  t.end()
})

test('curried function with no parameters', t => {
  const func = curry(() => 'string')

  t.equal(func(), 'string', 'returns the result of the passed in function')

  t.end()
})

test('curried function with one parameter', t => {
  const func = curry(x => x)

  t.equal(func('string'), 'string', 'returns the result of the passed in function')

  t.end()
})

test('curried function with multiple parameters', t => {
  const sumThree = (x, y, z) => x + y + z
  const func = curry(sumThree)

  t.equal(func(1, 2, 3), sumThree(1, 2, 3), 'returns the result when fully applied')
  t.equal(func(1)(2)(3), sumThree(1, 2, 3), 'returns the result when curried')
  t.equal(func(1, 2)(3), sumThree(1, 2, 3), 'returns the result when called (_, _)(_)')
  t.equal(func(1)(2, 3), sumThree(1, 2, 3), 'returns the result when called (_)(_, _)')
  t.equal(func(1, 2, 3, 4, 5), sumThree(1, 2, 3), 'ignores extra parameters')

  t.end()
})

test('curried function with curried function', t => {
  const sumThree = x => y => z => x + y + z
  const func = curry(sumThree)

  t.equal(func(1, 2, 3), sumThree(1)(2)(3), 'returns the result when fully applied')
  t.equal(func(1)(2)(3), sumThree(1)(2)(3), 'returns the result when curried')
  t.equal(func(1, 2)(3), sumThree(1)(2)(3), 'returns the result when called (_, _)(_)')
  t.equal(func(1)(2, 3), sumThree(1)(2)(3), 'returns the result when called (_), (_, _)')
  t.equal(func(1, 2, 3, 4, 5), sumThree(1)(2)(3), 'ignores extra parameters')

  t.end()
})

test('curried function with context application', t => {
  const sumThree = (x, y) => z => x + y + z
  const func = curry(sumThree)

  t.equal(func(1, 2, 3), sumThree(1, 2)(3), 'returns the result when fully applied')
  t.equal(func(1)(2)(3), sumThree(1, 2)(3), 'returns the result when curried')
  t.equal(func(1, 2)(3), sumThree(1, 2)(3), 'returns the result when called (_, _)(_)')
  t.equal(func(1)(2, 3), sumThree(1, 2)(3), 'returns the result when called (_), (_, _)')
  t.equal(func(1, 2, 3, 4, 5), sumThree(1, 2)(3), 'ignores extra parameters')

  t.end()
})
