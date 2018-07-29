import test from 'tape'

import * as Helpers from '.'

import alt from './alt'
import ap from './ap'
import bimap from './bimap'
import both from './both'
import chain from './chain'
import coalesce from './coalesce'
import compareWith from './compareWith'
import concat from './concat'
import cons from './cons'
import contramap from './contramap'
import either from './either'
import empty from './empty'
import equals from './equals'
import extend from './extend'
import filter from './filter'
import first from './first'
import fold from './fold'
import foldMap from './foldMap'
import head from './head'
import map from './map'
import merge from './merge'
import option from './option'
import promap from './promap'
import reduce from './reduce'
import reduceRight from './reduceRight'
import reject from './reject'
import run from './run'
import runWith from './runWith'
import second from './second'
import sequence from './sequence'
import swap from './swap'
import tail from './tail'
import traverse from './traverse'
import valueOf from './valueOf'

test('pointfree entry', t => {
  t.equal(Helpers.alt, alt, 'provides the alt pointfree')
  t.equal(Helpers.ap, ap, 'provides the ap pointfree')
  t.equal(Helpers.bimap, bimap, 'provides the bimap pointfree')
  t.equal(Helpers.both, both, 'provides the both pointfree')
  t.equal(Helpers.chain, chain, 'provides the chain pointfree')
  t.equal(Helpers.compareWith, compareWith, 'provides the compareWith pointfree')
  t.equal(Helpers.coalesce, coalesce, 'provides the coalesce pointfree')
  t.equal(Helpers.concat, concat, 'provides the concat pointfree')
  t.equal(Helpers.cons, cons, 'provides the cons pointfree')
  t.equal(Helpers.contramap, contramap, 'provides the contramap pointfree')
  t.equal(Helpers.either, either, 'provides the either pointfree')
  t.equal(Helpers.empty, empty, 'provides the empty pointfree')
  t.equal(Helpers.equals, equals, 'provides the equals pointfree')
  t.equal(Helpers.extend, extend, 'provides the extend pointfree')
  t.equal(Helpers.filter, filter, 'provides the filter pointfree')
  t.equal(Helpers.first, first, 'provides the first pointfree')
  t.equal(Helpers.fold, fold, 'provides the fold pointfree')
  t.equal(Helpers.foldMap, foldMap, 'provides the foldMap pointfree')
  t.equal(Helpers.head, head, 'provides the head pointfree')
  t.equal(Helpers.map, map, 'provides the map pointfree')
  t.equal(Helpers.merge, merge, 'provides the merge pointfree')
  t.equal(Helpers.option, option, 'provides the option pointfree')
  t.equal(Helpers.promap, promap, 'provides the promap pointfree')
  t.equal(Helpers.reduce, reduce, 'provides the reduce pointfree')
  t.equal(Helpers.reduceRight, reduceRight, 'provides the reduceRight pointfree')
  t.equal(Helpers.reject, reject, 'provides the reject pointfree')
  t.equal(Helpers.run, run, 'provides the run pointfree')
  t.equal(Helpers.runWith, runWith, 'provides the runWith pointfree')
  t.equal(Helpers.second, second, 'provides the second pointfree')
  t.equal(Helpers.sequence, sequence, 'provides the sequence pointfree')
  t.equal(Helpers.swap, swap, 'provides the swap pointfree')
  t.equal(Helpers.tail, tail, 'provides the tail pointfree')
  t.equal(Helpers.traverse, traverse, 'provides the traverse pointfree')
  t.equal(Helpers.valueOf, valueOf, 'provides the valueOf pointfree')

  t.end()
})
