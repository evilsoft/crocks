const test = require('tape')

const crocks = require('./crocks')

const composeB  = require('./combinators/composeB')
const k_comb  = require('./combinators/k_comb')
const t_comb  = require('./combinators/t_comb')
const i_comb  = require('./combinators/i_comb')

const compose = require('./funcs/compose')
const curry   = require('./funcs/curry')

const map   = require('./pointfree/map')
const ap    = require('./pointfree/ap')
const chain = require('./pointfree/chain')

const maybe = require('./pointfree/maybe')
const value = require('./pointfree/value')

const Maybe     = require('./crocks/Maybe')
const Identity  = require('./crocks/Identity')

test('entry', t => {
  t.equal(crocks.toString(), '[object Object]', 'is an object')

  t.equal(crocks.composeB, composeB, 'provides the B combinator')
  t.equal(crocks.i_comb, i_comb, 'provides the I combinator')
  t.equal(crocks.k_comb, k_comb, 'provides the K combinator')
  t.equal(crocks.t_comb, t_comb, 'provides the T combinator')

  t.equal(crocks.compose, compose, 'provides the compose helper function')
  t.equal(crocks.curry, curry, 'provides the curry helper function')

  t.equal(crocks.map, map, 'provides the map point-free function')
  t.equal(crocks.ap, ap, 'provides the ap point-free function')
  t.equal(crocks.chain, chain, 'provides the chain point-free function')

  t.equal(crocks.maybe, maybe, 'provides the maybe point-free function')
  t.equal(crocks.value, value, 'provides the value point-free function')

  t.equal(crocks.Maybe, Maybe, 'provides the Maybe function')
  t.equal(crocks.Identity, Identity, 'provides the Identity function')

  t.end()
})
