const test = require('tape')

const applyTo = require('./applyTo')
const composeB = require('./composeB')
const constant = require('./constant')
const flip = require('./flip')
const identity = require('./identity')
const substitution = require('./substitution')

test('combinators entry', t => {
    t.equal(applyTo, applyTo, 'provides the T combinator (applyTo)')
    t.equal(composeB, composeB, 'provides the B combinator (composeB)')
    t.equal(constant, constant, 'provides the K combinator (constant)')
    t.equal(flip, flip, 'provides the C combinator (flip)')
    t.equal(identity, identity, 'provides the I combinator (identity)')
    t.equal(substitution, substitution, 'provides the S combinator (substitution)')

    t.end()
})  
