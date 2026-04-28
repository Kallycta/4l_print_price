import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from "node:path"

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		vueDevTools(),
	],
	build: {
		outDir: '',
		assetsDir: 'local/components/4lapy/print.price.tag.2/templates/.default/vue3_template/print_price/dist/assets/',
		rolldownOptions: {
			input: {
				index: path.resolve(__dirname, 'src/main.js')
			},
			output: {
				// entryFileNames: 'local/components/4lapy/print.price.tag.2/templates/.default/build/[name].js',
				// chunkFileNames: 'local/components/4lapy/print.price.tag.2/templates/.default/build/[name].js',
				// assetFileNames: 'local/components/4lapy/print.price.tag.2/templates/.default/build/[name][extname]',
				codeSplitting: {
					groups: [
						{
							name: 'vue-libs',
							test: /[\\/]node_modules[\\/](vue|vue-router|pinia)[\\/]/,
							priority: 20,
						},
					],
				},
			},
		},
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		},
	},
})
