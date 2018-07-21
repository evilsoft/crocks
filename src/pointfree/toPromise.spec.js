const test = require('tape')

const isFunction  = require('../core/isFunction')

const Async = require('../Async')
const toPromise = require('./toPromise')

test('toPromise pointfree', t => {
  t.plan(3)

  const val = 1337

  const rej = y => x => t.equal(x, y, 'rejects a rejected Async')
  const res = y => x => t.equal(x, y, 'resolves a resolved Async')

  const testFunc = a => toPromise(a).then(res(val)).catch(rej(val))

  t.ok(isFunction(toPromise), 'is a function')

  testFunc(Async.Rejected(val))
  testFunc(Async.Resolved(val))
})
