import buble from 'rollup-plugin-buble'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

const input = 'src/index.js'

/* istanbul ignore next */
export default [{
  input,
  output: {
    file: 'build/cjs/crocks.js',
    plugins: [
      resolve(),
      buble(),
    ],
    format: 'cjs',
  }
}, {
  input,
  plugins: [
    resolve(),
    buble(),
    terser(),
  ],
  output: {
    file: 'build/crocks.min.js',
    format: 'umd',
    name: 'crocks',
  }
}]
