/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import compose from './compose.js'

const foldWith =
  m => (x, y) => x.concat(m(y))

// mconcatMap :: Monoid M => M -> (b -> a) -> ([ b ] | List b) -> M a
function mconcatMap(M, f, xs) {
  return xs.reduce(foldWith(compose(M, f)), M.empty())
}

export default mconcatMap
