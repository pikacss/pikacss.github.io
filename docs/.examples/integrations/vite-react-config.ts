// vite.config.ts
import PikaCSS from '@pikacss/unplugin-pikacss/vite'
import React from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		React(),
		PikaCSS(),
	],
})
