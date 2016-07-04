const test = require('tape')

const crocks = require('./crocks')

const compose = require('./funcs/compose')
const curry   = require('./funcs/curry')

test('entry', t => {
  t.equal(crocks.toString(), '[object Object]', 'is an object')

  t.equal(crocks.compose, compose, 'provides the compose function')
  t.equal(crocks.curry, curry, 'provides the compose function')
  t.end()
})
