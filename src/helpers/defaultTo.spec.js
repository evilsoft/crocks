import test from 'tape'

import defaultTo from './defaultTo'

test('defaultTo', t => {
  const fn =
    defaultTo('def')

  const g =
    () => 'func'

  t.equal(fn(undefined), 'def', 'defaults an undefined value')
  t.equal(fn(null), 'def', 'defaults a null value')
  t.equal(fn(NaN), 'def', 'defaults a NaN value')
  t.equal(fn(0), 0, 'does not default a falsey number')
  t.equal(fn(1), 1, 'does not default a truthy number')
  t.equal(fn(''), '', 'does not default a falsey string')
  t.equal(fn('string'), 'string', 'does not default a truthy string')
  t.equal(fn(false), false, 'does not default a false')
  t.equal(fn(true), true, 'does not default a true')
  t.equal(fn(g)(), 'func', 'does not default a function')
  t.same(fn({}), {}, 'does not default an object')
  t.same(fn([]), [], 'does not default an array')

  t.end()
})

