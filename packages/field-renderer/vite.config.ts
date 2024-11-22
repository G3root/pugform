import { resolve } from 'node:path'
import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'fieldRenderer',
			fileName: 'index',
		},
	},
	plugins: [preact(), tsconfigPaths(), dts()],
})
