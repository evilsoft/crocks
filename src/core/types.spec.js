const test = require('tape')

const isFunction = require('./isFunction')

const _types = require('./types')

test('types core', t => {
  const { types } = _types

  t.ok(isFunction(types), 'provides a `types` function')

  t.end()
})

test('types function ', t => {
  const { types } = _types

  const fn =
    x => types(x)()

  t.equals(fn('silly'), 'unknown', 'returns `unknown` if key is not defined')
  t.equals(fn('All'), 'All', 'returns `All` for key `All`')
  t.equals(fn('Any'), 'Any', 'returns `Any` for key `Any`')
  t.equals(fn('Arrow'), 'Arrow', 'returns `Arrow` for key `Arrow`')
  t.equals(fn('Assign'), 'Assign', 'returns `Assign` for key `Assign`')
  t.equals(fn('Async'), 'Async', 'returns `Async` for key `Async`')
  t.equals(fn('Const'), 'Const', 'returns `Const` for key `Const`')
  t.equals(fn('Either'), 'Either', 'returns `Either` for key `Either`')
  t.equals(fn('Endo'), 'Endo', 'returns `Endo` for key `Endo`')
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
