import buble from 'rollup-plugin-buble'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

const base = {
  input: 'src/index.js',
  preserveModules: true,
}

const minifiedLegacyBrowserBundle = {
  preserveModules: false,
  plugins: [
    resolve(),
    buble(),
    terser(),
  ]
};

const esm = {
  ...base,
  plugins: [
    resolve()
  ],
  output: {
    dir: 'build/es',
    format: 'es',
  },
}

const cjs = {
  ...base,
  output: {
    dir: 'build/cjs',
    format: 'cjs',
  },
  plugins: [
    resolve(),
    buble(),
  ],
}

const umd = {
  ...base,
  ...minifiedLegacyBrowserBundle,
  output: {
    file: 'build/umd/crocks.umd.min.js',
    format: 'umd',
    name: 'crocks',
  },
}

const system = {
  ...base,
  ...minifiedLegacyBrowserBundle,
  preserveModules: true,
  output: {
    dir: 'build/system',
    format: 'system'
  },
}

/* istanbul ignore next */
export default [
  esm,
  cjs,
  system,
  umd,
]
