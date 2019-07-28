/** @license ISC License (c) copyright 2019 original and current authors */
/** @author Paul Gray */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const compose = curry(require('../core/compose'))

const identity =
  x => x

module.exports = {
  Apply: (equals, fn, mapFn) => ({
    composition: (f, g, v) => equals(
      f[mapFn](compose)[fn](g)[fn](v),
      f[fn](g[fn](v))
    )
  }),
  Category: (equals, fn, composeFn) => ({
    leftIdentity: m => equals(
      m.constructor[fn]()[composeFn](m),
      m
    ),
    rightIdentity: m => equals(
      m[composeFn](m.constructor[fn]()),
      m
    )
  }),
  Chain: (equals, fn) => ({
    associativity: (f, g, m) => equals(
      m[fn](f)[fn](g),
      m[fn](x => f(x)[fn](g))
    )
  }),
  Contravariant: (equals, fn) => ({
    composition: (f, g, m) => equals(
      m[fn](compose(f, g)),
      m[fn](f)[fn](g)
    ),
    identity: m =>
      equals(m[fn](identity), m)
  }),
  Functor: (equals, fn) => ({
    composition: (f, g, m) => equals(
      m[fn](compose(f, g)),
      m[fn](g)[fn](f)
    ),
    identity: m =>
      equals(m[fn](identity), m)
  }),
  Monad: (equals, M, fn, chainFn) => ({
    leftIdentity: (f, x) =>
      equals(M[fn](x)[chainFn](f), f(x)),
    rightIdentity: (f, x) =>
      equals(f(x)[chainFn](M[fn]), f(x))
  }),
  Monoid: (equals, fn, concatFn) => ({
    leftIdentity: m =>
      equals(m.constructor[fn]()[concatFn](m), m),
    rightIdentity: m =>
      equals(m[concatFn](m.constructor[fn]()), m)
  }),
  Profunctor: (equals, fn) => ({
    composition: (f, g, h, k, m) => equals(
      m[fn](compose(f, g), compose(h, k)),
      m[fn](f, k)[fn](g, h)
    ),
    identity: m =>
      equals(m[fn](identity, identity), m)
  }),
  Semigroup: (equals, fn) => ({
    associativity: (m, n, o) => equals(
      m[fn](n)[fn](o),
      m[fn](n[fn](o))
    )
  }),
  Semigroupoid: (equals, fn) => ({
    associativity: (m, n, o) => equals(
      m[fn](n)[fn](o),
      m[fn](n[fn](o))
    )
  }),
  Setoid: fn => ({
    reflexivity: m => m[fn](m),
    symmetry: (m, n) => m[fn](n) === n[fn](m),
    transitivity: (m, n, o) => m[fn](n) && n[fn](o)
      ? m[fn](o)
      : true
  })
}
