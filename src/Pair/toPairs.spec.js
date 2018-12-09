const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Pair = require('../core/Pair')
const isSameType = require('../core/isSameType')
const unit = require('../core/_unit')

const toPairs = require('./toPairs')

test('toPairs', t => {
  const fn = bindFunc(toPairs)

  const err = /toPairs: Object or Array required for argument/
  t.throws(fn(undefined), err, 'throws when argument is undefined')
  t.throws(fn(null), err, 'throws when argument is null')
  t.throws(fn(0), err, 'throws when argument is a falsey number')
  t.throws(fn(1), err, 'throws when argument is a truthy number')
  t.throws(fn(''), err, 'throws when argument is a falsey string')
  t.throws(fn(false), err, 'throws when argument is false')
  t.throws(fn(true), err, 'throws when argument is true')
  t.throws(fn(unit), err, 'throws when argument is a function')

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
  const getPair = key => result.find(x => x.fst() === key) || Pair(null, 'No Key')

  t.ok(isSameType([], result), 'returns an array')
  t.ok(allPairs, 'array contains all Pairs')

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

test('toPairs with array', t => {
  const data = [
    undefined,
    null,
    0,
    1,
    '',
    'string',
    false,
    true,
    {},
    []
  ]
  const pairs = toPairs(data)
  const getPair = key => pairs.find(x => x.fst() === key) || Pair(null, 'No Key')
  t.equals(getPair('0').snd(), 'No Key', 'does not include indexes with undefined values')
  t.equals(getPair('1').snd(), null, 'includes indexes with null values')
  t.equals(getPair('2').snd(), 0, 'includes indexes with falsey number values')
  t.equals(getPair('3').snd(), 1, 'includes indexes with truthy number values')
  t.equals(getPair('4').snd(), '', 'includes indexes with falsey string values')
  t.equals(getPair('5').snd(), 'string', 'includes indexes with truthy string values')
  t.equals(getPair('6').snd(), false, 'includes indexes with false boolean values')
  t.equals(getPair('7').snd(), true, 'includes indexes with true boolean values')
  t.same(getPair('8').snd(), [], 'includes indexes with array values')
  t.same(getPair('9').snd(), {}, 'includes indexes with object values')
  t.end()
})
