const test = require('tape')
const sinon = require('sinon')

const constant = require('./constant')
const identity = require('./identity')

const merge  = require('./merge')

test('merge core', t => {
  const x = 34
  const m = { merge: sinon.spy(constant(x)) }

  merge(identity, m)

  t.ok(m.merge.calledWith(identity), 'calls merge on arrow, passing the function')
  t.ok(m.merge.returned(x), 'returns the result of m.merge')

  t.end()
})
