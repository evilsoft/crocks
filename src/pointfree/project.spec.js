const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const constant = x => () => x

const project = require('./project')

test('project pointfree', t => {
  const f = bindFunc(project)
  const x = 'result'
  const m = { project: sinon.spy(constant(x)) }

  t.ok(isFunction(project), 'is a function')

  const err = /project: Tuple required/
  t.throws(f(1, undefined), err, 'throws if passed undefined as the second argument')
  t.throws(f(1, null), err, 'throws if passed null as the second argument')
  t.throws(f(1, 0), err, 'throws if passed a falsey number as the second argument')
  t.throws(f(1, 1), err, 'throws if passed a truthy number as the second argument')
  t.throws(f(1, ''), err, 'throws if passed a falsey string as the second argument')
  t.throws(f(1, 'string'), err, 'throws if passed a truthy string as the second argument')
  t.throws(f(1, false), err, 'throws if passed false as the second argument')
  t.throws(f(1, true), err, 'throws if passed true as the second argument')
  t.throws(f(1, []), err, 'throws if passed an array as the second argument')
  t.throws(f(1, {}), err, 'throws if passed an object as the second argument')
  t.throws(f(1, unit), err, 'throws if passed a function as the second argument')

  const result = project(5, m)

  t.ok(m.project.calledWith(5), 'calls project on the passed container with the passed value')
  t.equal(result, x, 'returns the result of calling m.project')

  t.end()
})
