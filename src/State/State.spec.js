const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Pair = require('../core/Pair')
const Unit = require('../core/Unit')
const curry = require('../core/curry')
const compose = curry(require('../core/compose'))
const isObject = require('../core/isObject')
const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const identity = x => x

const State = require('.')

test('State', t => {
  const m = State(unit)
  const s = bindFunc(State)

  t.ok(isFunction(State), 'is a function')
  t.ok(isObject(m), 'returns an object')

  t.equals(State(unit).constructor, State, 'provides TypeRep on constructor')

  t.ok(isFunction(State.of), 'provides an of function')
  t.ok(isFunction(State.type), 'provides a type function')
  t.ok(isFunction(State.get), 'provides a get function')
  t.ok(isFunction(State.put), 'provides a put function')
  t.ok(isFunction(State.modify), 'provides a modify function')

  const err = /State: Must wrap a function in the form \(s -> Pair a s\)/
  t.throws(s(), err, 'throws with no parameters')

  t.throws(s(undefined), err, 'throws with undefined')
  t.throws(s(null), err, 'throws with null')
  t.throws(s(0), err, 'throws with falsey number')
  t.throws(s(1), err, 'throws with truthy number')
  t.throws(s(''), err, 'throws with falsey string')
  t.throws(s('string'), err, 'throws with truthy string')
  t.throws(s(false), err, 'throws with false')
  t.throws(s(true), err, 'throws with true')
  t.throws(s([]), err, 'throws with array')
  t.throws(s({}), err, 'throws with object')

  t.doesNotThrow(s(unit), 'allows a function')

  t.end()
})

test('State @@implements', t => {
  const f = State['@@implements']

  t.equal(f('ap'), true, 'implements ap func')
  t.equal(f('chain'), true, 'implements chain func')
  t.equal(f('map'), true, 'implements map func')
  t.equal(f('of'), true, 'implements of func')

  t.end()
})

test('State inspect', t => {
  const m = State(unit)

  t.ok(isFunction(m.inspect), 'provides an inspect function')
  t.equal(m.inspect(), 'State Function', 'returns inspect string')

  t.end()
})

test('State type', t => {
  t.equal(State(unit).type(), 'State', 'type returns State')
  t.end()
})

test('State runWith errors', t => {
  const runWith = bindFunc(State(identity).runWith)

  const err = /State.runWith: Must wrap a function in the form \(s -> Pair a s\)/
  t.throws(runWith(undefined), err, 'throws when wrapped function returns undefined')
  t.throws(runWith(null), err, 'throws when wrapped function returns null')
  t.throws(runWith(0), err, 'throws when wrapped function returns falsey number')
  t.throws(runWith(1), err, 'throws when wrapped function returns truthy number')
  t.throws(runWith(''), err, 'throws when wrapped function returns falsey string')
  t.throws(runWith('string'), err, 'throws when wrapped function returns truthy string')
  t.throws(runWith(false), err, 'throws when wrapped function returns false')
  t.throws(runWith(true), err, 'throws when wrapped function returns true')
  t.throws(runWith({}), err, 'throws when wrapped function returns an object')
  t.throws(runWith([]), err, 'throws when wrapped function returns an array')
  t.throws(runWith(unit), err, 'throws when wrapped function returns a function')

  t.end()
})

test('State runWith', t => {
  const f = sinon.spy(x => Pair(x * 2, x))

  const s = 34
  const result = State(f).runWith(s)

  t.ok(f.calledWith(s), 'runs internal function with argument')
  t.ok(f.returned(result), 'returns the result of the internal function')

  t.end()
})

test('State execWith', t => {
  const execWith = bindFunc(State(identity).execWith)

  const err = /State.execWith: Must wrap a function in the form \(s -> Pair a s\)/
  t.throws(execWith(undefined), err, 'throws when wrapped function returns undefined')
  t.throws(execWith(null), err, 'throws when wrapped function returns null')
  t.throws(execWith(0), err, 'throws when wrapped function returns falsey number')
  t.throws(execWith(1), err, 'throws when wrapped function returns truthy number')
  t.throws(execWith(''), err, 'throws when wrapped function returns falsey string')
  t.throws(execWith('string'), err, 'throws when wrapped function returns truthy string')
  t.throws(execWith(false), err, 'throws when wrapped function returns false')
  t.throws(execWith(true), err, 'throws when wrapped function returns true')
  t.throws(execWith({}), err, 'throws when wrapped function returns an object')
  t.throws(execWith([]), err, 'throws when wrapped function returns an array')
  t.throws(execWith(unit), err, 'throws when wrapped function returns a function')

  const target = 0
  const f = sinon.spy(x => Pair(x, target))

  const s = 99
  const result = State(f).execWith(s)

  t.ok(f.calledWith(s), 'runs passed function with argument')
  t.equal(result, target, 'returns the snd (state) of the pair')

  t.end()
})

test('State evalWith', t => {
  const evalWith = bindFunc(State(identity).evalWith)

  const err = /State.evalWith: Must wrap a function in the form \(s -> Pair a s\)/
  t.throws(evalWith(undefined), err, 'throws when wrapped function returns undefined')
  t.throws(evalWith(null), err, 'throws when wrapped function returns null')
  t.throws(evalWith(0), err, 'throws when wrapped function returns falsey number')
  t.throws(evalWith(1), err, 'throws when wrapped function returns truthy number')
  t.throws(evalWith(''), err, 'throws when wrapped function returns falsey string')
  t.throws(evalWith('string'), err, 'throws when wrapped function returns truthy string')
  t.throws(evalWith(false), err, 'throws when wrapped function returns false')
  t.throws(evalWith(true), err, 'throws when wrapped function returns true')
  t.throws(evalWith({}), err, 'throws when wrapped function returns an object')
  t.throws(evalWith([]), err, 'throws when wrapped function returns an array')
  t.throws(evalWith(unit), err, 'throws when wrapped function returns a function')

  const target = 'bullseye'
  const f = sinon.spy(x => Pair(target, x))

  const s = 'arrow'
  const result = State(f).evalWith(s)

  t.ok(f.calledWith(s), 'runs internal function with argument')
  t.equal(result, target, 'returns the fst (result) of the pair')

  t.end()
})

test('State get errors', t => {
  const get = bindFunc(State.get)

  const err = /State.get: No arguments or function required/
  t.throws(get(undefined), err, 'throws with undefined')
  t.throws(get(null), err, 'throws with null')
  t.throws(get(0), err, 'throws with falsey number')
  t.throws(get(1), err, 'throws with truthy number')
  t.throws(get(''), err, 'throws with falsey string')
  t.throws(get('string'), err, 'throws with truthy string')
  t.throws(get(false), err, 'throws with false')
  t.throws(get(true), err, 'throws with true')
  t.throws(get([]), err, 'throws with an array')
  t.throws(get({}), err, 'throws with an object')

  t.doesNotThrow(get(identity), 'does not throw with a function')
  t.doesNotThrow(get(), 'does not throw without a function')

  t.end()
})

test('State get with function', t => {
  const f = x => x * 2
  const v = 75

  const state = State.get(f)

  t.equals(state.type(), State.type(), 'returns a State')

  t.equals(state.runWith(v).type(), Pair.type(), 'returns a Pair when ran')
  t.equals(state.evalWith(v), f(v), 'sets the result value to value returned by the function')
  t.equals(state.execWith(v), v, 'sets the state value to ran state')

  t.end()
})

test('State get without function', t => {
  const v = 75

  const state = State.get()

  t.equals(state.type(), State.type(), 'returns a State')

  t.equals(state.runWith(v).type(), Pair.type(), 'returns a Pair when ran')
  t.equals(state.evalWith(v), v, 'sets the result value to value returned by the function')
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

  const err = /State.modify: Function Required/
  t.throws(modify(undefined), err, 'throws with undefined')
  t.throws(modify(null), err, 'throws with null')
  t.throws(modify(0), err, 'throws with falsey number')
  t.throws(modify(1), err, 'throws with truthy number')
  t.throws(modify(''), err, 'throws with falsey string')
  t.throws(modify('string'), err, 'throws with truthy string')
  t.throws(modify(false), err, 'throws with false')
  t.throws(modify(true), err, 'throws with true')
  t.throws(modify([]), err, 'throws with an array')
  t.throws(modify({}), err, 'throws with an object')

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
  const map = bindFunc(State(unit).map)

  const err = /State.map: Function required/
  t.throws(map(undefined), err, 'throws with undefined')
  t.throws(map(null), err, 'throws with null')
  t.throws(map(0), err, 'throws with falsey number')
  t.throws(map(1), err, 'throws with truthy number')
  t.throws(map(''), err, 'throws with falsey string')
  t.throws(map('string'), err, 'throws with truthy string')
  t.throws(map(false), err, 'throws with false')
  t.throws(map(true), err, 'throws with true')
  t.throws(map([]), err, 'throws with an array')
  t.throws(map({}), err, 'throws with an object')

  t.doesNotThrow(map(unit), 'allows a function')

  const m = bindFunc(State(identity).map(x => x + 1).runWith)
  const n = bindFunc(State(x => Pair(x, x)).map(x => x + 1).runWith)

  const noPair = /State.map: Must wrap a function in the form \(s -> Pair a s\)/
  t.throws(m(3), noPair, 'throws when wrapped function is not (s -> (a, s))')
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

  const a = m.map(compose(f, g)).runWith(34)
  const b = m.map(g).map(f).runWith(34)

  t.ok(m.runWith(3).equals(m.map(identity).runWith(3)), 'identity')
  t.ok(a.equals(b), 'composition')

  t.end()
})

test('State ap errors', t => {
  const ap = bindFunc(State(unit).ap)
  const m = { type: () => 'State...Not' }

  const err = /State.ap: State required/
  t.throws(ap(undefined), err, 'throws with undefined')
  t.throws(ap(null), err, 'throws with null')
  t.throws(ap(0), err, 'throws with falsey number')
  t.throws(ap(1), err, 'throws with truthy number')
  t.throws(ap(''), err, 'throws with falsey string')
  t.throws(ap('string'), err, 'throws with truthy string')
  t.throws(ap(false), err, 'throws with false')
  t.throws(ap(true), err, 'throws with true')
  t.throws(ap([]), err, 'throws with an array')
  t.throws(ap({}), err, 'throws with an object')
  t.throws(ap(m), err, 'throws when Non-State')

  const f = x => State(y => Pair(x, y))
  const n = State(identity)

  const noPair = bindFunc(n.ap(State(f)).runWith)

  const noPairErr = /State.ap: Must wrap a function in the form \(s -> Pair a s\)/
  t.throws(noPair(undefined), noPairErr, 'throws when inner function returns undefined')
  t.throws(noPair(null), noPairErr, 'throws when inner function returns null')
  t.throws(noPair(0), noPairErr, 'throws when inner function returns falsey number')
  t.throws(noPair(1), noPairErr, 'throws when inner function returns truthy number')
  t.throws(noPair(''), noPairErr, 'throws when inner function returns falsey string')
  t.throws(noPair('string'), noPairErr, 'throws when inner function returns truthy string')
  t.throws(noPair(false), noPairErr, 'throws when inner function returns false')
  t.throws(noPair(true), noPairErr, 'throws when inner function returns true')
  t.throws(noPair([]), noPairErr, 'throws when inner function returns an array')
  t.throws(noPair({}), noPairErr, 'throws when inner function returns an object')
  t.throws(noPair(unit), noPairErr, 'throws when inner function returns a function')

  const noFunc =
    x => bindFunc(State(s => Pair(x, s)).ap(f(3)).runWith)

  const noFuncErr = /State.ap: Source value must be a function/
  t.throws(noFunc(undefined)(3), noFuncErr, 'throws when source value is undefined')
  t.throws(noFunc(null)(3), noFuncErr, 'throws when source value is null')
  t.throws(noFunc(0)(3), noFuncErr, 'throws when source value is falsey number')
  t.throws(noFunc(1)(3), noFuncErr, 'throws when source value is truthy number')
  t.throws(noFunc('')(3), noFuncErr, 'throws when source value is falsey string')
  t.throws(noFunc('string')(3), noFuncErr, 'throws when source value is truthy string')
  t.throws(noFunc(false)(3), noFuncErr, 'throws when source value is false')
  t.throws(noFunc(true)(3), noFuncErr, 'throws when source value is true')
  t.throws(noFunc([])(3), noFuncErr, 'throws when source value is an array')
  t.throws(noFunc({})(3), noFuncErr, 'throws when source value is an object')

  t.end()
})

test('State ap properties (Apply)', t => {
  const f = x => x + 10
  const g = x => x * 0

  const lift = x => State(s => Pair(x, s))

  const m = lift(f)

  const a = m.map(compose).ap(lift(g)).ap(lift(9))
  const b = m.ap(lift(g).ap(lift(9)))

  t.ok(isFunction(State(unit).map), 'implements the Functor spec')
  t.ok(isFunction(State(unit).ap), 'provides an ap function')

  t.equal(a.evalWith(), b.evalWith(), 'composition')

  t.end()
})

test('State of', t => {
  t.equal(State.of, State(unit).of, 'of is the same as the instance version')
  t.equal(State.of(0).type(), 'State', 'returns a State')
  t.equal(State.of(0).evalWith(22), 0, 'wraps the value passed into State')

  t.end()
})

test('State of properties (Applicative)', t => {
  const m = State(s => Pair(s, s))
  const f = x => x * 9
  const v = 12
  const s = 38

  t.ok(isFunction(State(unit).of), 'provides an of function')
  t.ok(isFunction(State(unit).ap), 'implements the Apply spec')

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
  const chain = bindFunc(State(unit).chain)

  const err = /State.chain: State returning function required/
  t.throws(chain(undefined), err, 'throws with undefined')
  t.throws(chain(null), err, 'throws with null')
  t.throws(chain(0), err, 'throws with falsey number')
  t.throws(chain(1), err, 'throws with truthy number')
  t.throws(chain(''), err, 'throws with falsey string')
  t.throws(chain('string'), err, 'throws with truthy string')
  t.throws(chain(false), err, 'throws with false')
  t.throws(chain(true), err, 'throws with true')
  t.throws(chain([]), err, 'throws with an array')
  t.throws(chain({}), err, 'throws with an object')

  const f = x => State(y => Pair(x, y))
  const m = State(identity)

  const noPair = bindFunc(m.chain(f).runWith)

  const noPairErr = /State.chain: Must wrap a function in the form \(s -> Pair a s\)/
  t.throws(noPair(undefined), noPairErr, 'throws when inner function returns undefined')
  t.throws(noPair(null), noPairErr, 'throws when inner function returns null')
  t.throws(noPair(0), noPairErr, 'throws when inner function returns falsey number')
  t.throws(noPair(1), noPairErr, 'throws when inner function returns truthy number')
  t.throws(noPair(''), noPairErr, 'throws when inner function returns falsey string')
  t.throws(noPair('string'), noPairErr, 'throws when inner function returns truthy string')
  t.throws(noPair(false), noPairErr, 'throws when inner function returns false')
  t.throws(noPair(true), noPairErr, 'throws when inner function returns true')
  t.throws(noPair([]), noPairErr, 'throws when inner function returns an array')
  t.throws(noPair({}), noPairErr, 'throws when inner function returns an object')
  t.throws(noPair(unit), noPairErr, 'throws when inner function returns a function')

  const noState = bindFunc(State(() => Pair(0, 0)).chain(identity).runWith)

  const noStateErr = /State.chain: Function must return another State/
  t.throws(noState(undefined), noStateErr, 'throws when chain function returns undefined')
  t.throws(noState(null), noStateErr, 'throws when chain function returns null')
  t.throws(noState(0), noStateErr, 'throws when chain function returns falsey number')
  t.throws(noState(1), noStateErr, 'throws when chain function returns truthy number')
  t.throws(noState(''), noStateErr, 'throws when chain function returns falsey string')
  t.throws(noState('string'), noStateErr, 'throws when chain function returns truthy string')
  t.throws(noState(false), noStateErr, 'throws when chain function returns false')
  t.throws(noState(true), noStateErr, 'throws when chain function returns true')
  t.throws(noState([]), noStateErr, 'throws when chain function returns an array')
  t.throws(noState({}), noStateErr, 'throws when chain function returns an object')
  t.throws(noState(unit), noStateErr, 'throws when chain function returns a function')

  t.end()
})

test('State chain properties (Chain)', t => {
  t.ok(isFunction(State(unit).chain), 'provides a chain function')
  t.ok(isFunction(State(unit).ap), 'implements the Apply spec')

  const s = 8

  const f = x => State(s => Pair(x + s + 2, s))
  const g = x => State(s => Pair(x + s + 10, s))

  const a = x => State(s => Pair(x, s)).chain(f).chain(g)
  const b = x => State(s => Pair(x, s)).chain(y => f(y).chain(g))

  t.equal(a(10).evalWith(s), b(10).evalWith(s), 'assosiativity')

  t.end()
})

test('State chain properties (Monad)', t => {
  t.ok(State(unit).chain, 'implements ohe Chain spec')
  t.ok(State(unit).of, 'implements the Applicative spec')

  const f = x => State(s => Pair(x, s))

  t.equal(State.of(3).chain(f).evalWith(0), f(3).evalWith(0), 'left identity')
  t.equal(f(6).chain(State.of).evalWith(0), f(6).evalWith(0), 'right identity')

  t.end()
})
