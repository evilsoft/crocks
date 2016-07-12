/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const crocks = {
  Maybe: require('./crocks/Maybe'),
  Identity: require('./crocks/Identity')
}

const helpers = {
  compose:  require('./funcs/compose'),
  curry:    require('./funcs/curry')
}

const pointFree = {
  map:    require('./pointfree/map'),
  ap:     require('./pointfree/ap'),
  chain:  require('./pointfree/chain'),
  maybe:  require('./pointfree/maybe'),
  value:  require('./pointfree/value')
}

const combinators = {
  composeB: require('./combinators/composeB'),
  identity: require('./combinators/identity'),
  constant: require('./combinators/constant'),
  t_comb:   require('./combinators/t_comb')
}

module.exports = Object.assign(
  {},
  combinators,
  helpers,
  pointFree,
  crocks
)
