import test from 'tape'

import * as Predicates from '.'

import hasProp from './hasProp'
import hasPropPath from './hasPropPath'
import isAlt from './isAlt'
import isAlternative from './isAlternative'
import isApplicative from './isApplicative'
import isApply from './isApply'
import isArray from './isArray'
import isBifunctor from './isBifunctor'
import isBoolean from './isBoolean'
import isCategory from './isCategory'
import isChain from './isChain'
import isContravariant from './isContravariant'
import isDate from './isDate'
import isDefined from './isDefined'
import isEmpty from './isEmpty'
import isExtend from './isExtend'
import isFoldable from './isFoldable'
import isFunction from './isFunction'
import isFunctor from './isFunctor'
import isInteger from './isInteger'
import isIterable from './isIterable'
import isMonad from './isMonad'
import isMonoid from './isMonoid'
import isNil from './isNil'
import isNumber from './isNumber'
import isObject from './isObject'
import isPlus from './isPlus'
import isProfunctor from './isProfunctor'
import isPromise from './isPromise'
import isSame from './isSame'
import isSameType from './isSameType'
import isSemigroup from './isSemigroup'
import isSemigroupoid from './isSemigroupoid'
import isSetoid from './isSetoid'
import isString from './isString'
import isTraversable from './isTraversable'
import propEq from './propEq'
import propPathEq from './propPathEq'
import propSatisfies from './propSatisfies'
import propPathSatisfies from './propPathSatisfies'

test('predicates entry', t => {
  t.equal(Predicates.hasProp, hasProp, 'provides the hasProp predicate')
  t.equal(Predicates.hasPropPath, hasPropPath, 'provides the hasPropPath predicate')
  t.equal(Predicates.isAlt, isAlt, 'provides the isAlt predicate')
  t.equal(Predicates.isAlternative, isAlternative, 'provides the isAlternative predicate')
  t.equal(Predicates.isApply, isApply, 'provides the isApply predicate')
  t.equal(Predicates.isApplicative, isApplicative, 'provides the isApply predicate')
  t.equal(Predicates.isArray, isArray, 'provides the isArray predicate')
  t.equal(Predicates.isBifunctor, isBifunctor, 'provides the isBifunctor predicate')
  t.equal(Predicates.isBoolean, isBoolean, 'provides the isBoolean predicate')
  t.equal(Predicates.isCategory, isCategory, 'provides the isCategory predicate')
  t.equal(Predicates.isChain, isChain, 'provides the isChain predicate')
  t.equal(Predicates.isContravariant, isContravariant, 'provides the isContravariant predicate')
  t.equal(Predicates.isDate, isDate, 'provides the isDate predicate')
  t.equal(Predicates.isDefined, isDefined, 'provides the isDefined predicate')
  t.equal(Predicates.isEmpty, isEmpty, 'provides the isEmpty predicate')
  t.equal(Predicates.isExtend, isExtend, 'provides the isExtend predicate')
  t.equal(Predicates.isFoldable, isFoldable, 'provides the isFoldable predicate')
  t.equal(Predicates.isFunction, isFunction, 'provides the isFunction predicate')
  t.equal(Predicates.isFunctor, isFunctor, 'provides the isFunctor predicate')
  t.equal(Predicates.isInteger, isInteger, 'provides the isInteger predicate')
  t.equal(Predicates.isIterable, isIterable, 'provides the isIterable predicate')
  t.equal(Predicates.isMonad, isMonad, 'provides the isMonad predicate')
  t.equal(Predicates.isMonoid, isMonoid, 'provides the isMonoid predicate')
  t.equal(Predicates.isNil, isNil, 'provides the isNil predicate')
  t.equal(Predicates.isNumber, isNumber, 'provides the isNumber predicate')
  t.equal(Predicates.isObject, isObject, 'provides the isObject predicate')
  t.equal(Predicates.isPlus, isPlus, 'provides the isPlus predicate')
  t.equal(Predicates.isProfunctor, isProfunctor, 'provides the isProfunctor predicate')
  t.equal(Predicates.isPromise, isPromise, 'provides the isPromise predicate')
  t.equal(Predicates.isSame, isSame, 'provides the isSame predicate')
  t.equal(Predicates.isSameType, isSameType, 'provides the isSameType predicate')
  t.equal(Predicates.isSemigroup, isSemigroup, 'provides the isSemigroup predicate')
  t.equal(Predicates.isSemigroupoid, isSemigroupoid, 'provides the isSemigroupoid predicate')
  t.equal(Predicates.isSetoid, isSetoid, 'provides the isSetoid predicate')
  t.equal(Predicates.isString, isString, 'provides the isString predicate')
  t.equal(Predicates.isTraversable, isTraversable, 'provides the isTraversable predicate')
  t.equal(Predicates.propEq, propEq, 'provides the propEq predicate')
  t.equal(Predicates.propPathEq, propPathEq, 'provides the propEq predicate')
  t.equal(Predicates.propSatisfies, propSatisfies, 'provides the propSatisfies predicate')
  t.equal(Predicates.propPathSatisfies, propPathSatisfies, 'provides the propPathSatisfies predicate')

  t.end()
})
