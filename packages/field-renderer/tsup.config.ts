import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm'],
	dts: true,
	splitting: false,
	sourcemap: true,
	clean: true,
	jsxFactory: 'h',
	jsxFragment: 'Fragment',
	outDir: 'dist/js',
	bundle: true,
})
