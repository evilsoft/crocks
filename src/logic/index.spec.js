import test from 'tape'

import * as Logic from '.'

import and from './and'
import ifElse from './ifElse'
import not from './not'
import or from './or'
import unless from './unless'
import when from './when'

test('logic entry', t => {

  t.equal(Logic.and, and, 'provides the and logic')
  t.equal(Logic.ifElse, ifElse, 'provides the ifElse logic')
  t.equal(Logic.not, not, 'provides the not logic')
  t.equal(Logic.or, or, 'provides the or logic')
  t.equal(Logic.unless, unless, 'provides the unless logic')
  t.equal(Logic.when, when, 'provides the when logic')

  t.end()
})
