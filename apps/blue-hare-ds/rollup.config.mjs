import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import postcss from 'rollup-plugin-postcss'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))
const deps = [
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.dependencies || {}),
]
const external = [
  ...deps,
  ...deps.map(d => new RegExp(`^${d}(/.*)?$`)),
]

/** Inline plugin: imports .svg files as data:image/svg+xml URIs */
function svgDataUrl() {
  return {
    name: 'svg-data-url',
    load(id) {
      if (!id.endsWith('.svg')) return null
      const svg = readFileSync(id, 'utf-8').trim().replace(/\r?\n/g, ' ').replace(/\s+/g, ' ')
      const encoded = svg
        .replace(/"/g, "'")
        .replace(/%/g, '%25')
        .replace(/#/g, '%23')
        .replace(/\{/g, '%7B')
        .replace(/\}/g, '%7D')
        .replace(/</g, '%3C')
        .replace(/>/g, '%3E')
      return `export default "data:image/svg+xml,${encoded}"`
    },
  }
}

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist/esm',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
      sourcemap: true,
    },
    {
      dir: 'dist/cjs',
      format: 'cjs',
      preserveModules: true,
      preserveModulesRoot: 'src',
      sourcemap: true,
      exports: 'named',
    },
  ],
  external,
  plugins: [
    svgDataUrl(),
    resolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
    postcss({
      extract: 'styles.css',
      minimize: true,
      plugins: [
        (await import('@tailwindcss/postcss')).default,
      ],
    }),
    esbuild({
      target: 'es2020',
      jsx: 'automatic',
      tsconfig: 'tsconfig.build.json',
    }),
  ],
})
