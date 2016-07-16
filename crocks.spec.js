const test = require('tape')

const crocks = require('./crocks')

const applyTo       = require('./combinators/applyTo')
const composeB      = require('./combinators/composeB')
const constant      = require('./combinators/constant')
const reverseApply  = require('./combinators/reverseApply')
const identity      = require('./combinators/identity')

const compose = require('./funcs/compose')
const curry   = require('./funcs/curry')
const mconcat = require('./funcs/mconcat')
const liftA   = require('./funcs/liftA')

const map     = require('./pointfree/map')
const ap      = require('./pointfree/ap')
const chain   = require('./pointfree/chain')
const concat  = require('./pointfree/concat')

const maybe = require('./pointfree/maybe')
const value = require('./pointfree/value')

const Maybe     = require('./crocks/Maybe')
const Identity  = require('./crocks/Identity')

const Any = require('./monoids/Any')
const All = require('./monoids/All')

test('entry', t => {
  t.equal(crocks.toString(), '[object Object]', 'is an object')

  t.equal(crocks.applyTo, applyTo, 'provides the A combinator')
  t.equal(crocks.composeB, composeB, 'provides the B combinator')
  t.equal(crocks.constant, constant, 'provides the K combinator')
  t.equal(crocks.identity, identity, 'provides the I combinator')
  t.equal(crocks.reverseApply, reverseApply, 'provides the T combinator')

  t.equal(crocks.compose, compose, 'provides the compose function')
  t.equal(crocks.curry, curry, 'provides the curry function')
  t.equal(crocks.mconcat, mconcat, 'provides the mconcat function')
  t.equal(crocks.liftA, liftA, 'provides the liftA function')

  t.equal(crocks.map, map, 'provides the map point-free function')
  t.equal(crocks.ap, ap, 'provides the ap point-free function')
  t.equal(crocks.chain, chain, 'provides the chain point-free function')
  t.equal(crocks.concat, concat, 'provides the concat point-free function')

  t.equal(crocks.maybe, maybe, 'provides the maybe point-free function')
  t.equal(crocks.value, value, 'provides the value point-free function')

  t.equal(crocks.Maybe, Maybe, 'provides the Maybe function')
  t.equal(crocks.Identity, Identity, 'provides the Identity function')

  t.equal(crocks.Any, Any, 'provides the Any function')
  t.equal(crocks.All, All, 'provides the All function')

  t.end()
})
