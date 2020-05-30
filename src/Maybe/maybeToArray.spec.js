const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Maybe = require('../core/Maybe')

const isArray = require('../core/isArray')
const isFunction = require('../core/isFunction')

const identity = x => x

const maybeToArray = require('./maybeToArray')

test('maybeToArray transform', t => {
  const f = bindFunc(maybeToArray)

  t.ok(isFunction(maybeToArray), 'is a function')

  const err = /maybeToArray: Argument must be a Maybe instanstace or a Maybe returning function/
  t.throws(f(undefined), err, 'throws if second arg is undefined')
  t.throws(f(null), err, 'throws if second arg is null')
  t.throws(f(0), err, 'throws if second arg is a falsey number')
  t.throws(f(1), err, 'throws if second arg is a truthy number')
  t.throws(f(''), err, 'throws if second arg is a falsey string')
  t.throws(f('string'), err, 'throws if second arg is a truthy string')
  t.throws(f(false), err, 'throws if second arg is false')
  t.throws(f(true), err, 'throws if second arg is true')
  t.throws(f([]), err, 'throws if second arg is an array')
  t.throws(f({}), err, 'throws if second arg is an object')

  t.end()
})

test('maybeToArray with Maybe', t => {
  const some = 'something'

  const good = maybeToArray(Maybe.Just(some))
  const bad = maybeToArray(Maybe.Nothing())

  t.ok(isArray(good), 'returns an Array with a Just')
  t.ok(isArray(bad), 'returns an Array with a Nothing')

  t.same(good, [ some ], 'Just maps to single item Array containing the value')
  t.same(bad, [], 'Nothing maps to an empty Array')

  t.end()
})

test('maybeToArray with Maybe returning function', t => {
  const some = 'something'

  t.ok(isFunction(maybeToArray(Maybe.of)), 'returns a function')

  const f = bindFunc(maybeToArray(identity))

  const err = /maybeToArray: Argument must be a Maybe instanstace or a Maybe returning function/
  t.throws(f(undefined), err, 'throws if function returns undefined')
  t.throws(f(null), err, 'throws if function returns null')
  t.throws(f(0), err, 'throws if function returns a falsey number')
  t.throws(f(1), err, 'throws if function returns a truthy number')
  t.throws(f(''), err, 'throws if function returns a falsey string')
  t.throws(f('string'), err, 'throws if function returns a truthy string')
  t.throws(f(false), err, 'throws if function returns false')
  t.throws(f(true), err, 'throws if function returns true')
  t.throws(f([]), err, 'throws if function returns an array')
  t.throws(f({}), err, 'throws if function returns an object')

  const lift =
    x => x !== undefined ? Maybe.Just(x) : Maybe.Nothing()

  const good = maybeToArray(lift, some)
  const bad = maybeToArray(lift, undefined)

  t.ok(isArray(good), 'returns an Array with a Just')
  t.ok(isArray(bad), 'returns an Array with a Nothing')

  t.same(good, [ some ], 'Just maps to single item Array containing the value')
  t.same(bad, [], 'Nothing maps to an empty Array')

  t.end()
})
