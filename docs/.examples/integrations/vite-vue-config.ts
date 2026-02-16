// vite.config.ts
import PikaCSS from '@pikacss/unplugin-pikacss/vite'
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		Vue(),
		PikaCSS(),
	],
})
