/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _types = {
  'unk': () => 'unknown',
  'All': () => 'All',
  'Any': () => 'Any',
  'Arrow': () => 'Arrow',
  'Assign': () => 'Assign',
  'Async': () => 'Async',
  'Const': () => 'Const',
  'Either': () => 'Either',
  'Endo': () => 'Endo',
  'Equiv': () => 'Equiv',
  'First': () => 'First',
  'Identity': () => 'Identity',
  'IO': () => 'IO',
  'Last': () => 'Last',
  'List': () => 'List',
  'Max': () => 'Max',
  'Maybe': () => 'Maybe',
  'Min': () => 'Min',
  'Pair': () => 'Pair',
  'Pred': () => 'Pred',
  'Prod': () => 'Prod',
  'Reader': () => 'Reader',
  'Result': () => 'Result',
  'Star': () => 'Star',
  'State': () => 'State',
  'Sum': () => 'Sum',
  'Unit': () => 'Unit',
  'Writer': () => 'Writer',
}

const type =
  type => _types[type] || _types['unk']

const proxy =
  t => ({ type: type(t) })

module.exports = {
  proxy, type
}
