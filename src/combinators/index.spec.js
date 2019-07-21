const test = require('tape')

const index = require('.')

const applyTo = require('./applyTo')
const composeB = require('./composeB')
const compose2 = require('./compose2')
const constant = require('./constant')
const converge = require('./converge')
const flip = require('./flip')
const identity = require('./identity')
const psi = require('./psi')
const substitution = require('./substitution')

test('combinators entry', t => {
  t.equal(index.applyTo, applyTo, 'provides the T combinator (applyTo)')
  t.equal(index.composeB, composeB, 'provides the B combinator (composeB)')
  t.equal(index.compose2, compose2, 'provides the compose2 combinator')
  t.equal(index.constant, constant, 'provides the K combinator (constant)')
  t.equal(index.converge, converge, 'provides the S\' combinator (converge)')
  t.equal(index.flip, flip, 'provides the C combinator (flip)')
  t.equal(index.identity, identity, 'provides the I combinator (identity)')
  t.equal(index.psi, psi, 'provides the P combinator (psi)')
  t.equal(index.substitution, substitution, 'provides the S combinator (substitution)')

  t.end()
})
