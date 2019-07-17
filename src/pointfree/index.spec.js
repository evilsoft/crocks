const test = require('tape')

const index = require('.')

const expected = {
  alt : require('./alt'),
  ap : require('./ap'),
  bichain: require('./bichain'),
  bimap : require('./bimap'),
  both : require('./both'),
  chain : require('./chain'),
  coalesce : require('./coalesce'),
  compareWith : require('./compareWith'),
  concat : require('./concat'),
  cons : require('./cons'),
  contramap : require('./contramap'),
  either : require('./either'),
  empty : require('./empty'),
  equals : require('./equals'),
  extend : require('./extend'),
  filter : require('./filter'),
  first : require('./first'),
  fold : require('./fold'),
  foldMap : require('./foldMap'),
  head : require('./head'),
  init : require('./init'),
  last : require('./last'),
  map : require('./map'),
  merge : require('./merge'),
  option : require('./option'),
  promap : require('./promap'),
  reduce : require('./reduce'),
  reduceRight : require('./reduceRight'),
  reject : require('./reject'),
  run : require('./run'),
  runWith : require('./runWith'),
  second : require('./second'),
  sequence : require('./sequence'),
  swap : require('./swap'),
  tail : require('./tail'),
  traverse : require('./traverse'),
  valueOf : require('./valueOf')
}

test('pointfree entry', t => {
  Object.entries(expected).forEach(([ key, value ]) => t.equal(index[key], value, `provides the ${key} pointfree`))

  t.same(index, expected, 'provides the expected entry')

  t.end()
})
