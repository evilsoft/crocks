const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const List = require('../core/List')
const Pair = require('../core/Pair')
const isSameType = require('../core/isSameType')
const unit = require('../core/_unit')

const toPairs = require('./toPairs')

test('toPairs', t => {
  const fn = bindFunc(toPairs)

  const err = /toPairs: Argument must be an Object/
  t.throws(fn(undefined), err, 'throws when argument is undefined')
  t.throws(fn(null), err, 'throws when argument is null')
  t.throws(fn(0), err, 'throws when argument is a falsey number')
  t.throws(fn(1), err, 'throws when argument is a truthy number')
  t.throws(fn(''), err, 'throws when argument is a falsey string')
  t.throws(fn(false), err, 'throws when argument is false')
  t.throws(fn(true), err, 'throws when argument is true')
  t.throws(fn(unit), err, 'throws when argument is a function')
  t.throws(fn([]), err, 'throws when argument is an array')

  const data = {
    undef: undefined,
    nil: null,
    falseNumber: 0,
    trueNumber: 1,
    falseString: '',
    trueString: 'string',
    falseBoolean: false,
    trueBoolean: true,
    obj: {},
    array: []
  }

  const result = toPairs(data)
  const allPairs = result.reduce((acc, x) => acc && isSameType(Pair, x), true)
  const getPair = key => result.filter(x => x.fst() === key).head().option(Pair(null, 'No Key'))

  t.ok(isSameType(List, result), 'returns a List')
  t.ok(allPairs, 'list contains all Pairs')

  t.equals(getPair('undef').snd(), 'No Key', 'does not include keys with undefined values')
  t.equals(getPair('nil').snd(), null, 'includes keys with null values')
  t.equals(getPair('falseNumber').snd(), 0, 'includes keys with falsey number values')
  t.equals(getPair('trueNumber').snd(), 1, 'includes keys with truthy number values')
  t.equals(getPair('falseString').snd(), '', 'includes keys with falsey string values')
  t.equals(getPair('trueString').snd(), 'string', 'includes keys with truthy string values')
  t.equals(getPair('falseBoolean').snd(), false, 'includes keys with false boolean values')
  t.equals(getPair('trueBoolean').snd(), true, 'includes keys with true boolean values')
  t.same(getPair('array').snd(), [], 'includes keys with array values')
  t.same(getPair('obj').snd(), {}, 'includes keys with object values')

  t.end()
})
