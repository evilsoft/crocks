const test = require('tape')

const methods = require('./flNames')

test('flMethods', t => {
  t.equals(methods.alt, 'fantasy-land/alt', 'provides alt')
  t.equals(methods.bimap, 'fantasy-land/bimap', 'provides bimap')
  t.equals(methods.chain, 'fantasy-land/chain', 'provides chain')
  t.equals(methods.compose, 'fantasy-land/compose', 'provides compose')
  t.equals(methods.concat, 'fantasy-land/concat', 'provides concat')
  t.equals(methods.contramap, 'fantasy-land/contramap', 'provides contramap')
  t.equals(methods.empty, 'fantasy-land/empty', 'provides empty')
  t.equals(methods.equals, 'fantasy-land/equals', 'provides equals')
  t.equals(methods.extend, 'fantasy-land/extend', 'provides extend')
  t.equals(methods.id, 'fantasy-land/id', 'provides id')
  t.equals(methods.map, 'fantasy-land/map', 'provides map')
  t.equals(methods.of, 'fantasy-land/of', 'provides of')
  t.equals(methods.promap, 'fantasy-land/promap', 'provides promap')
  t.equals(methods.reduce, 'fantasy-land/reduce', 'provides reduce')
  t.equals(methods.zero, 'fantasy-land/zero', 'provides zero')

  t.end()
})
