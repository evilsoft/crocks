const test = require('tape')

const index = require('.')

const and = require('./and')
const ifElse = require('./ifElse')
const not = require('./not')
const or = require('./or')
const unless = require('./unless')
const when = require('./when')

test('logic entry', t => {

  t.equal(index.and, and, 'provides the and logic')
  t.equal(index.ifElse, ifElse, 'provides the ifElse logic')
  t.equal(index.not, not, 'provides the not logic')
  t.equal(index.or, or, 'provides the or logic')
  t.equal(index.unless, unless, 'provides the unless logic')
  t.equal(index.when, when, 'provides the when logic')

  t.end()
})
