const identity = require('../combinators/identity')
const fl = require('../core/flNames')
const compose = require('../core/compose')

const curriedCompose = f => g => x => f(g(x))

module.exports = {
  apply: {
    composition: (equals, f, g, m) => equals(
      f.map(compose).ap(g).ap(m),
      f.ap(g.ap(m))
    )
  },
  applicative: type => ({
    identity: (equals, x) => equals(
      type.of(identity).ap(x),
      x
    ),
    homomorphism: (equals, f, x) => equals(
      type.of(f).ap(type.of(x)),
      type.of(f(x))
    ),
    interchange: (equals, mFn, x) => equals(
      mFn.ap(type.of(x)),
      type.of(f => f(x)).ap(mFn)
    )
  }),

  // https://github.com/fantasyland/fantasy-land#applicative
  'fl/apply': type => ({
    // https://medium.com/@JosephJnk/an-introduction-to-applicative-functors-aea966799b1d
    // ap(ap(ap(pure(compose), u), v), w) must be equal to ap(u, ap(v, w))
    composition: (equals, mF, mG, m) => equals(
      m[fl.ap](mG[fl.ap](mF[fl.ap](type[fl.of](curriedCompose)))),
      m[fl.ap](mG)[fl.ap](mF)
    )
  }),
  'fl/applicative': type => ({
    identity: (equals, x) => equals(
      type[fl.of](x)[fl.ap](type[fl.of](identity)),
      type[fl.of](x)
    ),
    homomorphism: (equals, f, x) => equals(
      type[fl.of](x)[fl.ap](type[fl.of](f)),
      type[fl.of](f(x))
    ),
    interchange: (equals, mFn, x) => equals(
      mFn[fl.ap](type[fl.of](f => f(x))),
      type[fl.of](x)[fl.ap](mFn)
    )
  })
}
