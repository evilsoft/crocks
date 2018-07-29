import test from 'tape'

import Combinators from '.'

import applyTo from './applyTo'
import composeB from './composeB'
import constant from './constant'
import flip from './flip'
import identity from './identity'
import substitution from './substitution'

test('combinators entry', t => {
  t.equal(Combinators.applyTo, applyTo, 'provides the T combinator (applyTo)')
  t.equal(Combinators.composeB, composeB, 'provides the B combinator (composeB)')
  t.equal(Combinators.constant, constant, 'provides the K combinator (constant)')
  t.equal(Combinators.flip, flip, 'provides the C combinator (flip)')
  t.equal(Combinators.identity, identity, 'provides the I combinator (identity)')
  t.equal(Combinators.substitution, substitution, 'provides the S combinator (substitution)')

  t.end()
})
