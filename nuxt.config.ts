import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-05-15',
	devtools: { enabled: true },
	css: ['~/assets/css/main.css'],
	vite: {
		plugins: [tailwindcss()],
	},
	ui: {
		fonts: true,
	},
	runtimeConfig: {
		public: {
			firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
			firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
			firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
			firebaseStorageBucket:
				process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
			firebaseMessagingSenderId:
				process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
			firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
		},
	},
	modules: [
		'@nuxt/content',
		'@nuxt/eslint',
		'@nuxt/fonts',
		'@nuxt/icon',
		'@nuxt/image',
		'@nuxt/scripts',
		'@nuxt/test-utils',
		'@nuxt/ui',
		'@pinia/nuxt',
		'@nuxtjs/mdc',
	],
})
