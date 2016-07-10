/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const crocks = {
  Maybe: require('./crocks/Maybe')
}

const helpers = {
  compose:  require('./funcs/compose'),
  curry:    require('./funcs/curry')
}

const pointFree = {
  map:    require('./pointfree/map'),
  ap:     require('./pointfree/ap'),
  chain:  require('./pointfree/chain'),
  maybe:  require('./pointfree/maybe')
}

const combinators = {
  b_comb: require('./combinators/b_comb'),
  i_comb: require('./combinators/i_comb'),
  k_comb: require('./combinators/k_comb'),
  t_comb: require('./combinators/t_comb')
}

module.exports = Object.assign(
  {},
  combinators,
  helpers,
  pointFree,
  crocks
)
