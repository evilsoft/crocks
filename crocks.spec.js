const test = require('tape')

const crocks = require('./crocks')

const compose = require('./funcs/compose')
const curry   = require('./funcs/curry')

const Maybe   = require('./crocks/Maybe')

test('entry', t => {
  t.equal(crocks.toString(), '[object Object]', 'is an object')

  t.equal(crocks.compose, compose, 'provides the compose function')
  t.equal(crocks.curry, curry, 'provides the curry function')

  t.equal(crocks.Maybe, Maybe, 'provides the Maybe function')

  t.end()
})
