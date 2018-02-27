const test = require('tape')

const isFunction = require('./isFunction')

const _types = require('./types')

test('types core', t => {
  const { proxy, type, typeFn } = _types

  t.ok(isFunction(type), 'provides a `types` function')
  t.ok(isFunction(proxy), 'provides a `proxy` function')
  t.ok(isFunction(typeFn), 'provides a `typeFn` function')

  t.end()
})

test('type function ', t => {
  const { type } = _types

  const fn =
    x => type(x)()

  t.equals(fn('silly'), 'unknown', 'returns `unknown` if key is not defined')
  t.equals(fn('All'), 'All', 'returns `All` for key `All`')
  t.equals(fn('Any'), 'Any', 'returns `Any` for key `Any`')
  t.equals(fn('Arrow'), 'Arrow', 'returns `Arrow` for key `Arrow`')
  t.equals(fn('Assign'), 'Assign', 'returns `Assign` for key `Assign`')
  t.equals(fn('Async'), 'Async', 'returns `Async` for key `Async`')
  t.equals(fn('Const'), 'Const', 'returns `Const` for key `Const`')
  t.equals(fn('Either'), 'Either', 'returns `Either` for key `Either`')
  t.equals(fn('Endo'), 'Endo', 'returns `Endo` for key `Endo`')
  t.equals(fn('Equiv'), 'Equiv', 'returns `Equiv` for key `Equiv`')
  t.equals(fn('First'), 'First', 'returns `First` for key `First`')
  t.equals(fn('Identity'), 'Identity', 'returns `Identity` for key `Identity`')
  t.equals(fn('IO'), 'IO', 'returns `IO` for key `IO`')
  t.equals(fn('Last'), 'Last', 'returns `Last` for key `Last`')
  t.equals(fn('List'), 'List', 'returns `List` for key `List`')
  t.equals(fn('Max'), 'Max', 'returns `Max` for key `Max`')
  t.equals(fn('Maybe'), 'Maybe', 'returns `Maybe` for key `Maybe`')
  t.equals(fn('Min'), 'Min', 'returns `Min` for key `Min`')
  t.equals(fn('Pair'), 'Pair', 'returns `Pair` for key `Pair`')
  t.equals(fn('Pred'), 'Pred', 'returns `Pred` for key `Pred`')
  t.equals(fn('Prod'), 'Prod', 'returns `Prod` for key `Prod`')
  t.equals(fn('Reader'), 'Reader', 'returns `Reader` for key `Reader`')
  t.equals(fn('Result'), 'Result', 'returns `Result` for key `Result`')
  t.equals(fn('Star'), 'Star', 'returns `Star` for key `Star`')
  t.equals(fn('State'), 'State', 'returns `State` for key `State`')
  t.equals(fn('Sum'), 'Sum', 'returns `Sum` for key `Sum`')
  t.equals(fn('Unit'), 'Unit', 'returns `Unit` for key `Unit`')
  t.equals(fn('Writer'), 'Writer', 'returns `Writer` for key `Writer`')

  t.end()
})

test('proxy function ', t => {
  const { proxy } = _types

  const fn =
    x => proxy(x).type()

  t.equals(fn('silly'), 'unknown', 'returns `unknown` if key is not defined')
  t.equals(fn('All'), 'All', 'returns `All` for key `All`')
  t.equals(fn('Any'), 'Any', 'returns `Any` for key `Any`')
  t.equals(fn('Arrow'), 'Arrow', 'returns `Arrow` for key `Arrow`')
  t.equals(fn('Assign'), 'Assign', 'returns `Assign` for key `Assign`')
  t.equals(fn('Async'), 'Async', 'returns `Async` for key `Async`')
  t.equals(fn('Const'), 'Const', 'returns `Const` for key `Const`')
  t.equals(fn('Either'), 'Either', 'returns `Either` for key `Either`')
  t.equals(fn('Endo'), 'Endo', 'returns `Endo` for key `Endo`')
  t.equals(fn('Equiv'), 'Equiv', 'returns `Equiv` for key `Equiv`')
  t.equals(fn('First'), 'First', 'returns `First` for key `First`')
  t.equals(fn('Identity'), 'Identity', 'returns `Identity` for key `Identity`')
  t.equals(fn('IO'), 'IO', 'returns `IO` for key `IO`')
  t.equals(fn('Last'), 'Last', 'returns `Last` for key `Last`')
  t.equals(fn('List'), 'List', 'returns `List` for key `List`')
  t.equals(fn('Max'), 'Max', 'returns `Max` for key `Max`')
  t.equals(fn('Maybe'), 'Maybe', 'returns `Maybe` for key `Maybe`')
  t.equals(fn('Min'), 'Min', 'returns `Min` for key `Min`')
  t.equals(fn('Pair'), 'Pair', 'returns `Pair` for key `Pair`')
  t.equals(fn('Pred'), 'Pred', 'returns `Pred` for key `Pred`')
  t.equals(fn('Prod'), 'Prod', 'returns `Prod` for key `Prod`')
  t.equals(fn('Reader'), 'Reader', 'returns `Reader` for key `Reader`')
  t.equals(fn('Result'), 'Result', 'returns `Result` for key `Result`')
  t.equals(fn('Star'), 'Star', 'returns `Star` for key `Star`')
  t.equals(fn('State'), 'State', 'returns `State` for key `State`')
  t.equals(fn('Sum'), 'Sum', 'returns `Sum` for key `Sum`')
  t.equals(fn('Unit'), 'Unit', 'returns `Unit` for key `Unit`')
  t.equals(fn('Writer'), 'Writer', 'returns `Writer` for key `Writer`')

  t.end()
})

test('typeFn function ', t => {
  const { typeFn } = _types

  const fn =
    (x, v) => typeFn(x, v)

  t.equals(fn('All'), 'crocks/All@0', 'returns `crocks/All@0` for key `All` with no version')
  t.equals(fn('All', 1), 'crocks/All@1', 'returns `crocks/All@1` for key `All` with a version of 1')

  t.equals(fn('silly'), 'crocks/unknown@0', 'returns `crocks/unknown@0` if key is not defined')
  t.equals(fn('All'), 'crocks/All@0', 'returns `crocks/All@0` for key `All`')
  t.equals(fn('Any'), 'crocks/Any@0', 'returns `crocks/Any@0` for key `Any`')
  t.equals(fn('Arrow'), 'crocks/Arrow@0', 'returns `crocks/Arrow@0` for key `Arrow`')
  t.equals(fn('Assign'), 'crocks/Assign@0', 'returns `crocks/Assign@0` for key `Assign`')
  t.equals(fn('Async'), 'crocks/Async@0', 'returns `crocks/Async@0` for key `Async`')
  t.equals(fn('Const'), 'crocks/Const@0', 'returns `crocks/Const@0` for key `Const`')
  t.equals(fn('Either'), 'crocks/Either@0', 'returns `crocks/Either@0` for key `Either`')
  t.equals(fn('Endo'), 'crocks/Endo@0', 'returns `crocks/Endo@0` for key `Endo`')
  t.equals(fn('Equiv'), 'crocks/Equiv@0', 'returns `crocks/Equiv@0` for key `Equiv`')
  t.equals(fn('First'), 'crocks/First@0', 'returns `crocks/First@0` for key `First`')
  t.equals(fn('Identity'), 'crocks/Identity@0', 'returns `crocks/Identity@0` for key `Identity`')
  t.equals(fn('IO'), 'crocks/IO@0', 'returns `crocks/IO@0` for key `IO`')
  t.equals(fn('Last'), 'crocks/Last@0', 'returns `crocks/Last@0` for key `Last`')
  t.equals(fn('List'), 'crocks/List@0', 'returns `crocks/List@0` for key `List`')
  t.equals(fn('Max'), 'crocks/Max@0', 'returns `crocks/Max@0` for key `Max`')
  t.equals(fn('Maybe'), 'crocks/Maybe@0', 'returns `crocks/Maybe@0` for key `Maybe`')
  t.equals(fn('Min'), 'crocks/Min@0', 'returns `crocks/Min@0` for key `Min`')
  t.equals(fn('Pair'), 'crocks/Pair@0', 'returns `crocks/Pair@0` for key `Pair`')
  t.equals(fn('Pred'), 'crocks/Pred@0', 'returns `crocks/Pred@0` for key `Pred`')
  t.equals(fn('Prod'), 'crocks/Prod@0', 'returns `crocks/Prod@0` for key `Prod`')
  t.equals(fn('Reader'), 'crocks/Reader@0', 'returns `crocks/Reader@0` for key `Reader`')
  t.equals(fn('Result'), 'crocks/Result@0', 'returns `crocks/Result@0` for key `Result`')
  t.equals(fn('Star'), 'crocks/Star@0', 'returns `crocks/Star@0` for key `Star`')
  t.equals(fn('State'), 'crocks/State@0', 'returns `crocks/State@0` for key `State`')
  t.equals(fn('Sum'), 'crocks/Sum@0', 'returns `crocks/Sum@0` for key `Sum`')
  t.equals(fn('Unit'), 'crocks/Unit@0', 'returns `crocks/Unit@0` for key `Unit`')
  t.equals(fn('Writer'), 'crocks/Writer@0', 'returns `crocks/Writer@0` for key `Writer`')

  t.end()
})
