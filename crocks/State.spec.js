const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const noop = helpers.noop
const bindFunc = helpers.bindFunc
const isObject = require('../internal/isObject')
const isFunction = require('../internal/isFunction')

const identity = require('../combinators/identity')
const constant = require('../combinators/constant')
const composeB = require('../combinators/composeB')

const Pair = require('./Pair')
const Unit = require('./Unit')
const State = require('./State')

test('State', t => {
  const m = State(noop)
  const s = bindFunc(State)

  t.ok(isFunction(State), 'is a function')
  t.ok(isObject(m), 'returns an object')

  t.ok(isFunction(State.of), 'provides an of function')
  t.ok(isFunction(State.type), 'provides a type function')
  t.ok(isFunction(State.get), 'provides a get function')
  t.ok(isFunction(State.gets), 'provides a gets function')
  t.ok(isFunction(State.put), 'provides a put function')
  t.ok(isFunction(State.modify), 'provides a modify function')

  t.throws(s(), TypeError, 'throws with no parameters')

  t.throws(s(undefined), TypeError, 'throws with undefined')
  t.throws(s(null), TypeError, 'throws with null')
  t.throws(s(0), TypeError, 'throws with falsey number')
  t.throws(s(1), TypeError, 'throws with truthy number')
  t.throws(s(''), TypeError, 'throws with falsey string')
  t.throws(s('string'), TypeError, 'throws with truthy string')
  t.throws(s(false), TypeError, 'throws with false')
  t.throws(s(true), TypeError, 'throws with true')
  t.throws(s([]), TypeError, 'throws with array')
  t.throws(s({}), TypeError, 'throws with object')

  t.doesNotThrow(s(noop), 'allows a function')

  t.end()
})

test('State inspect', t => {
  const m = State(noop)

  t.ok(isFunction(m.inspect), 'provides an inspect function')
  t.equal(m.inspect(), 'State Function', 'returns inspect string')

  t.end()
})

test('State type', t => {
  t.equal(State(noop).type(), 'State', 'type returns State')
  t.end()
})

test('State runWith', t => {
  const f = sinon.spy(x => x * 2)

  const s = 34
  const result = State(f).runWith(s)

  t.ok(f.calledWith(s), 'runs internal function with argument')
  t.ok(f.returned(result), 'returns the result of the internal function')

  t.end()
})

test('State execWith', t => {
  const target = 0
  const f = sinon.spy(x => Pair(x, target))

  const s = 99
  const result = State(f).execWith(s)

  t.ok(f.calledWith(s), 'runs passed function with argument')
  t.equal(result, target, 'returns the snd (state) of the pair')

  t.end()
})

test('State evalWith', t => {
  const target = 'bullseye'
  const f = sinon.spy(x => Pair(target, x))

  const s = 'arrow'
  const result = State(f).evalWith(s)

  t.ok(f.calledWith(s), 'runs internal function with argument')
  t.equal(result, target, 'returns the fst (result) of the pair')

  t.end()
})

test('State get', t => {
  const state = State.get()
  const v = 75

  t.equals(state.type(), State.type(), 'returns a State')
  t.equals(state.runWith(v).type(), Pair.type(), 'returns a Pair when ran')
  t.equals(state.evalWith(v), v, 'sets the result value to ran state')
  t.equals(state.execWith(v), v, 'sets the state value to ran state')

  t.end()
})

test('State gets', t => {
  const gets = bindFunc(State.gets)

  t.throws(gets(undefined), TypeError, 'throws with undefined')
  t.throws(gets(null), TypeError, 'throws with null')
  t.throws(gets(0), TypeError, 'throws with falsey number')
  t.throws(gets(1), TypeError, 'throws with truthy number')
  t.throws(gets(''), TypeError, 'throws with falsey string')
  t.throws(gets('string'), TypeError, 'throws with truthy string')
  t.throws(gets(false), TypeError, 'throws with false')
  t.throws(gets(true), TypeError, 'throws with true')
  t.throws(gets([]), TypeError, 'throws with an array')
  t.throws(gets({}), TypeError, 'throws with an object')

  const f = x => x * 2
  const v = 75

  const state = State.gets(f)

  t.equals(state.type(), State.type(), 'returns a State')
  t.equals(state.runWith(v).type(), Pair.type(), 'returns a Pair when ran')
  t.equals(state.evalWith(v), f(v), 'sets the result value to value returned by the function')
  t.equals(state.execWith(v), v, 'sets the state value to ran state')

  t.end()
})

test('State put', t => {
  const v = 75
  const s = 0

  const state = State.put(v)

  t.equals(state.type(), State.type(), 'returns a State')
  t.equals(state.runWith(s).type(), Pair.type(), 'returns a Pair when ran')
  t.equals(state.evalWith(s).type(), Unit.type(), 'sets the result value to a Unit')
  t.equals(state.execWith(s), v, 'overrides state value to put value')

  t.end()
})

test('State modify', t => {
  const modify = bindFunc(State.modify)

  t.throws(modify(undefined), TypeError, 'throws with undefined')
  t.throws(modify(null), TypeError, 'throws with null')
  t.throws(modify(0), TypeError, 'throws with falsey number')
  t.throws(modify(1), TypeError, 'throws with truthy number')
  t.throws(modify(''), TypeError, 'throws with falsey string')
  t.throws(modify('string'), TypeError, 'throws with truthy string')
  t.throws(modify(false), TypeError, 'throws with false')
  t.throws(modify(true), TypeError, 'throws with true')
  t.throws(modify([]), TypeError, 'throws with an array')
  t.throws(modify({}), TypeError, 'throws with an object')

  const f = x => x  + 10
  const s = 75

  const state = State.modify(f)

  t.equals(state.type(), State.type(), 'returns a State')
  t.equals(state.runWith(s).type(), Pair.type(), 'returns a Pair when ran')
  t.equals(state.evalWith(s).type(), Unit.type(), 'sets the result value to a Unit')
  t.equals(state.execWith(s), f(s), 'overrides state value to put value')

  t.end()
})

test('State map errors', t => {
  const map = bindFunc(State(noop).map)

  t.throws(map(undefined), TypeError, 'throws with undefined')
  t.throws(map(null), TypeError, 'throws with null')
  t.throws(map(0), TypeError, 'throws with falsey number')
  t.throws(map(1), TypeError, 'throws with truthy number')
  t.throws(map(''), TypeError, 'throws with falsey string')
  t.throws(map('string'), TypeError, 'throws with truthy string')
  t.throws(map(false), TypeError, 'throws with false')
  t.throws(map(true), TypeError, 'throws with true')
  t.throws(map([]), TypeError, 'throws with an array')
  t.throws(map({}), TypeError, 'throws with an object')

  t.doesNotThrow(map(noop), 'allows a function')

  const m = bindFunc(State(identity).map(x => x + 1).runWith)
  const n = bindFunc(State(x => Pair(x, x)).map(x => x + 1).runWith)

  t.throws(m(3), 'throws when wrapped function is not (s -> (a, s))')
  t.doesNotThrow(n(3), 'throws when wrapped function is not (s -> (a, s))')

  t.end()
})

test('State map functionality', t => {
  const fn = sinon.spy(x => x + 10)
  const m = State(s => Pair(s, s)).map(fn)

  t.equals(m.type(), 'State', 'returns a State')
  t.notOk(fn.called, 'does not call mapping function initially')

  const result = m.runWith(5)

  t.ok(fn.called, 'calls mapping function when ran')
  t.equal(result.snd(), 5, 'provides state unchanged')
  t.ok(fn.returned(result.fst()), 'applied map to value')

  t.end()
})

test('State map properties (Functor)', t => {
  const m = State(s => Pair(s, s))

  t.ok(isFunction(m.map), 'provides a map function')

  const f = x => x + 12
  const g = x => x * 10

  const a = m.map(composeB(f, g)).runWith(34)
  const b = m.map(g).map(f).runWith(34)

  t.ok(m.runWith(3).equals(m.map(identity).runWith(3)), 'identity')
  t.ok(a.equals(b), 'composition')

  t.end()
})

test('State ap errors', t => {
  const ap = bindFunc(State(noop).ap)
  const m = { type: () => 'State...Not' }

  t.throws(ap(undefined), TypeError, 'throws with undefined')
  t.throws(ap(null), TypeError, 'throws with null')
  t.throws(ap(0), TypeError, 'throws with falsey number')
  t.throws(ap(1), TypeError, 'throws with truthy number')
  t.throws(ap(''), TypeError, 'throws with falsey string')
  t.throws(ap('string'), TypeError, 'throws with truthy string')
  t.throws(ap(false), TypeError, 'throws with false')
  t.throws(ap(true), TypeError, 'throws with true')
  t.throws(ap([]), TypeError, 'throws with an array')
  t.throws(ap({}), TypeError, 'throws with an object')
  t.throws(ap(m), TypeError, 'throws when Non-State')

  const f = x => State(y => Pair(x, y))
  const n = State(identity)

  const noPair = bindFunc(n.ap(State(f)).runWith)

  t.throws(noPair(undefined), TypeError, 'throws when inner function returns undefined')
  t.throws(noPair(null), TypeError, 'throws when inner function returns null')
  t.throws(noPair(0), TypeError, 'throws when inner function returns falsey number')
  t.throws(noPair(1), TypeError, 'throws when inner function returns truthy number')
  t.throws(noPair(''), TypeError, 'throws when inner function returns falsey string')
  t.throws(noPair('string'), TypeError, 'throws when inner function returns truthy string')
  t.throws(noPair(false), TypeError, 'throws when inner function returns false')
  t.throws(noPair(true), TypeError, 'throws when inner function returns true')
  t.throws(noPair([]), TypeError, 'throws when inner function returns an array')
  t.throws(noPair({}), TypeError, 'throws when inner function returns an object')
  t.throws(noPair(noop), TypeError, 'throws when inner function returns a function')

  const noFunc =
    x => bindFunc(State(s => Pair(x, s)).ap(f(3)).runWith)

  t.throws(noFunc(undefined)(3), TypeError, 'throws when source value is undefined')
  t.throws(noFunc(null)(3), TypeError, 'throws when source value is null')
  t.throws(noFunc(0)(3), TypeError, 'throws when source value is falsey number')
  t.throws(noFunc(1)(3), TypeError, 'throws when source value is truthy number')
  t.throws(noFunc('')(3), TypeError, 'throws when source value is falsey string')
  t.throws(noFunc('string')(3), TypeError, 'throws when source value is truthy string')
  t.throws(noFunc(false)(3), TypeError, 'throws when source value is false')
  t.throws(noFunc(true)(3), TypeError, 'throws when source value is true')
  t.throws(noFunc([])(3), TypeError, 'throws when source value is an array')
  t.throws(noFunc({})(3), TypeError, 'throws when source value is an object')

  t.end()
})

test('State ap properties (Apply)', t => {
  const f = x => x + 10
  const g = x => x * 0

  const lift = x => State(s => Pair(x, s))

  const m = lift(f)

  const a = m.map(composeB).ap(lift(g)).ap(lift(9))
  const b = m.ap(lift(g).ap(lift(9)))

  t.ok(isFunction(State(noop).map), 'implements the Functor spec')
  t.ok(isFunction(State(noop).ap), 'provides an ap function')

  t.equal(a.evalWith(), b.evalWith(), 'composition')

  t.end()
})

test('State of', t => {
  t.equal(State.of, State(noop).of, 'of is the same as the instance version')
  t.equal(State.of(0).type(), 'State', 'returns a State')
  t.equal(State.of(0).evalWith(22), 0, 'wraps the value passed into State')

  t.end()
})

test('State of properties (Applicative)', t => {
  const m = State(s => Pair(s, s))
  const f = x => x * 9
  const v = 12
  const s = 38

  t.ok(isFunction(State(noop).of), 'provides an of function')
  t.ok(isFunction(State(noop).ap), 'implements the Apply spec')

  t.equal(State.of(identity).ap(m).evalWith(s), m.evalWith(s), 'identity')

  t.equal(
    State.of(f).ap(State.of(v)).evalWith(s),
    State.of(f(v)).evalWith(s),
    'homomorphism'
  )

  const u = State.of(f)
  const a = x => u.ap(State.of(x))
  const b = x => State.of(f => f(x)).ap(u)

  t.equal(a(3).evalWith(s), b(3).evalWith(s), 'interchange')

  t.end()
})

test('State chain errors', t => {
  const chain = bindFunc(State(noop).chain)

  t.throws(chain(undefined), TypeError, 'throws with undefined')
  t.throws(chain(null), TypeError, 'throws with null')
  t.throws(chain(0), TypeError, 'throws with falsey number')
  t.throws(chain(1), TypeError, 'throws with truthy number')
  t.throws(chain(''), TypeError, 'throws with falsey string')
  t.throws(chain('string'), TypeError, 'throws with truthy string')
  t.throws(chain(false), TypeError, 'throws with false')
  t.throws(chain(true), TypeError, 'throws with true')
  t.throws(chain([]), TypeError, 'throws with an array')
  t.throws(chain({}), TypeError, 'throws with an object')

  const f = x => State(y => Pair(x, y))
  const m = State(identity)

  const noPair = bindFunc(m.chain(f).runWith)

  t.throws(noPair(undefined), TypeError, 'throws when inner function returns undefined')
  t.throws(noPair(null), TypeError, 'throws when inner function returns null')
  t.throws(noPair(0), TypeError, 'throws when inner function returns falsey number')
  t.throws(noPair(1), TypeError, 'throws when inner function returns truthy number')
  t.throws(noPair(''), TypeError, 'throws when inner function returns falsey string')
  t.throws(noPair('string'), TypeError, 'throws when inner function returns truthy string')
  t.throws(noPair(false), TypeError, 'throws when inner function returns false')
  t.throws(noPair(true), TypeError, 'throws when inner function returns true')
  t.throws(noPair([]), TypeError, 'throws when inner function returns an array')
  t.throws(noPair({}), TypeError, 'throws when inner function returns an object')
  t.throws(noPair(noop), TypeError, 'throws when inner function returns a function')

  const noState = bindFunc(m.chain(identity).runWith)

  t.throws(noState(undefined), TypeError, 'throws when chain function returns undefined')
  t.throws(noState(null), TypeError, 'throws when chain function returns null')
  t.throws(noState(0), TypeError, 'throws when chain function returns falsey number')
  t.throws(noState(1), TypeError, 'throws when chain function returns truthy number')
  t.throws(noState(''), TypeError, 'throws when chain function returns falsey string')
  t.throws(noState('string'), TypeError, 'throws when chain function returns truthy string')
  t.throws(noState(false), TypeError, 'throws when chain function returns false')
  t.throws(noState(true), TypeError, 'throws when chain function returns true')
  t.throws(noState([]), TypeError, 'throws when chain function returns an array')
  t.throws(noState({}), TypeError, 'throws when chain function returns an object')
  t.throws(noState(noop), TypeError, 'throws when chain function returns a function')

  t.end()
})

test('State chain properties (Chain)', t => {
  t.ok(isFunction(State(noop).chain), 'provides a chain function')
  t.ok(isFunction(State(noop).ap), 'implements the Apply spec')

  const s = 8

  const f = x => State(s => Pair(x + s + 2, s))
  const g = x => State(s => Pair(x + s + 10, s))

  const a = x => State(s => Pair(x, s)).chain(f).chain(g)
  const b = x => State(s => Pair(x, s)).chain(y => f(y).chain(g))

  t.equal(a(10).evalWith(s), b(10).evalWith(s), 'assosiativity')

  t.end()
})

test('State chain properties (Monad)', t => {
  t.ok(State(noop).chain, 'implements ohe Chain spec')
  t.ok(State(noop).of, 'implements the Applicative spec')

  const f = x => State(s => Pair(x, s))

  t.equal(State.of(3).chain(f).evalWith(0), f(3).evalWith(0), 'left identity')
  t.equal(f(6).chain(State.of).evalWith(0), f(6).evalWith(0), 'right identity')

  t.end()
})
