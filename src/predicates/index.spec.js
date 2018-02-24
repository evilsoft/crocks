const test = require('tape')

const hasProp = require('./hasProp')
const hasPropPath = require('./hasPropPath')
const isAlt = require('./isAlt')
const isAlternative = require('./isAlternative')
const isApplicative = require('./isApplicative')
const isApply = require('./isApply')
const isArray = require('./isArray')
const isBifunctor = require('./isBifunctor')
const isBoolean = require('./isBoolean')
const isCategory = require('./isCategory')
const isChain = require('./isChain')
const isContravariant = require('./isContravariant')
const isDefined = require('./isDefined')
const isEmpty = require('./isEmpty')
const isExtend = require('./isExtend')
const isFoldable = require('./isFoldable')
const isFunction = require('./isFunction')
const isFunctor = require('./isFunctor')
const isInteger = require('./isInteger')
const isMonad = require('./isMonad')
const isMonoid = require('./isMonoid')
const isNil = require('./isNil')
const isNumber = require('./isNumber')
const isObject = require('./isObject')
const isPlus = require('./isPlus')
const isProfunctor = require('./isProfunctor')
const isPromise = require('./isPromise')
const isSame = require('./isSame')
const isSameType = require('./isSameType')
const isSemigroup = require('./isSemigroup')
const isSemigroupoid = require('./isSemigroupoid')
const isSetoid = require('./isSetoid')
const isString = require('./isString')
const isTraversable = require('./isTraversable')
const propEq = require('./propEq')
const propPathEq = require('./propPathEq')

test('predicates entry', t => {
  t.equal(hasProp, hasProp, 'provides the hasProp predicate')
  t.equal(hasPropPath, hasPropPath, 'provides the hasPropPath predicate')
  t.equal(isAlt, isAlt, 'provides the isAlt predicate')
  t.equal(isAlternative, isAlternative, 'provides the isAlternative predicate')
  t.equal(isApply, isApply, 'provides the isApply predicate')
  t.equal(isApplicative, isApplicative, 'provides the isApply predicate')
  t.equal(isArray, isArray, 'provides the isArray predicate')
  t.equal(isBifunctor, isBifunctor, 'provides the isBifunctor predicate')
  t.equal(isBoolean, isBoolean, 'provides the isBoolean predicate')
  t.equal(isCategory, isCategory, 'provides the isCategory predicate')
  t.equal(isChain, isChain, 'provides the isChain predicate')
  t.equal(isContravariant, isContravariant, 'provides the isContravariant predicate')
  t.equal(isDefined, isDefined, 'provides the isDefined predicate')
  t.equal(isEmpty, isEmpty, 'provides the isEmpty predicate')
  t.equal(isExtend, isExtend, 'provides the isExtend predicate')
  t.equal(isFoldable, isFoldable, 'provides the isFoldable predicate')
  t.equal(isFunction, isFunction, 'provides the isFunction predicate')
  t.equal(isFunctor, isFunctor, 'provides the isFunctor predicate')
  t.equal(isInteger, isInteger, 'provides the isInteger predicate')
  t.equal(isMonad, isMonad, 'provides the isMonad predicate')
  t.equal(isMonoid, isMonoid, 'provides the isMonoid predicate')
  t.equal(isNil, isNil, 'provides the isNil predicate')
  t.equal(isNumber, isNumber, 'provides the isNumber predicate')
  t.equal(isObject, isObject, 'provides the isObject predicate')
  t.equal(isPlus, isPlus, 'provides the isPlus predicate')
  t.equal(isProfunctor, isProfunctor, 'provides the isProfunctor predicate')
  t.equal(isPromise, isPromise, 'provides the isPromise predicate')
  t.equal(isSame, isSame, 'provides the isSame predicate')
  t.equal(isSameType, isSameType, 'provides the isSameType predicate')
  t.equal(isSemigroup, isSemigroup, 'provides the isSemigroup predicate')
  t.equal(isSemigroupoid, isSemigroupoid, 'provides the isSemigroupoid predicate')
  t.equal(isSetoid, isSetoid, 'provides the isSetoid predicate')
  t.equal(isString, isString, 'provides the isString predicate')
  t.equal(isTraversable, isTraversable, 'provides the isTraversable predicate')
  t.equal(propEq, propEq, 'provides the propEq predicate')
  t.equal(propPathEq, propPathEq, 'provides the propEq predicate')

  t.end()
})
