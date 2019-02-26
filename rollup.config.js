import buble from 'rollup-plugin-buble'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

const input = 'src/index.mjs'

const base = {
  input,
  experimentalCodeSplitting: true,
  experimentalPreserveModules: true,
}

const esm = {
  ...base,
  output: {
    dir: 'build',
    format: 'es',
  },
}

const cjs = {
  ...base,
  output: {
    dir: 'build_cjs',
    format: 'cjs',
    plugins: [
      resolve(),
      buble(),
    ],
  },
}

const umd = {
  input,
  output: {
    file: 'build/crocks.min.js',
    format: 'umd',
    name: 'crocks',
  },
  plugins: [
    resolve(),
    buble(),
    terser(),
  ],
}

/* istanbul ignore next */
export default [esm, cjs, umd]
