const test    = require('tape')
const helpers = require('../test/helpers')

const curry = require('./curry')

const noop      = helpers.noop
const bindFunc  = helpers.bindFunc

test('curry', t => {
  const c = bindFunc(curry)

  t.equal(typeof curry, 'function', 'curry is a function')

  t.throws(c(undefined), TypeError, 'throws TypeError when undefined passed')
  t.throws(c(null), TypeError, 'throws TypeError when null passed')

  t.throws(curry, TypeError, 'throws TypeError when nothing passed')
  t.throws(c(''), TypeError, 'throws TypeError when falsey string passed')
  t.throws(c('string'), TypeError, 'throws TypeError when truthy string passed')
  t.throws(c(0), TypeError, 'throws TypeError when falsy number passed')
  t.throws(c(1), TypeError, 'throws TypeError when truthy number passed')
  t.throws(c(false), TypeError, 'throws TypeError when false passed')
  t.throws(c(true), TypeError, 'throws TypeError when true passed')

  t.equal(typeof curry(noop), 'function', 'returns a function')

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
  const sumThree  = (x, y, z) => x + y + z
  const func      = curry(sumThree)

  t.equal(func(1, 2, 3), sumThree(1, 2, 3), 'returns the result when fully applied')
  t.equal(func(1)(2)(3), sumThree(1, 2, 3), 'returns the result when curried')
  t.equal(func(1, 2)(3), sumThree(1, 2, 3), 'returns the result when called (_, _)(_)')
  t.equal(func(1)(2, 3), sumThree(1, 2, 3), 'returns the result when called (_), (_, _)')
  t.equal(func(1, 2, 3, 4, 5), sumThree(1, 2, 3), 'ignores extra parameters')

  t.end()
})

test('curried function with curried function', t => {
  const sumThree  = x => y => z => x + y + z
  const func      = curry(sumThree)

  t.equal(func(1, 2, 3), sumThree(1)(2)(3), 'returns the result when fully applied')
  t.equal(func(1)(2)(3), sumThree(1)(2)(3), 'returns the result when curried')
  t.equal(func(1, 2)(3), sumThree(1)(2)(3), 'returns the result when called (_, _)(_)')
  t.equal(func(1)(2, 3), sumThree(1)(2)(3), 'returns the result when called (_), (_, _)')
  t.equal(func(1, 2, 3, 4, 5), sumThree(1)(2)(3), 'ignores extra parameters')

  t.end()
})

test('curried function with context application', t => {
  const sumThree  = (x, y) => z => x + y + z
  const func      = curry(sumThree)

  t.equal(func(1, 2, 3), sumThree(1, 2)(3), 'returns the result when fully applied')
  t.equal(func(1)(2)(3), sumThree(1, 2)(3), 'returns the result when curried')
  t.equal(func(1, 2)(3), sumThree(1, 2)(3), 'returns the result when called (_, _)(_)')
  t.equal(func(1)(2, 3), sumThree(1, 2)(3), 'returns the result when called (_), (_, _)')
  t.equal(func(1, 2, 3, 4, 5), sumThree(1, 2)(3), 'ignores extra parameters')

  t.end()
})
