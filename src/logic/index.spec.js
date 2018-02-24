const test = require('tape')

const and = require('./and')
const ifElse = require('./ifElse')
const not = require('./not')
const or = require('./or')
const unless = require('./unless')
const when = require('./when')


test('logic entry', t => {

    t.equal(and, and, 'provides the and logic')
    t.equal(ifElse, ifElse, 'provides the ifElse logic')
    t.equal(not, not, 'provides the not logic')
    t.equal(or, or, 'provides the or logic')
    t.equal(unless, unless, 'provides the unless logic')
    t.equal(when, when, 'provides the when logic')

    t.end()
})  
