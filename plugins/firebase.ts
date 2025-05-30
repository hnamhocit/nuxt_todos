import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

import type { FirebaseOptions } from 'firebase/app'
export default defineNuxtPlugin((nuxtApp) => {
	const runtimeConfig = useRuntimeConfig()

	const firebaseConfig: FirebaseOptions = {
		apiKey: runtimeConfig.public.firebaseApiKey as string,
		authDomain: runtimeConfig.public.firebaseAuthDomain as string,
		projectId: runtimeConfig.public.firebaseProjectId as string,
		storageBucket: runtimeConfig.public.firebaseStorageBucket as string,
		messagingSenderId: runtimeConfig.public
			.firebaseMessagingSenderId as string,
		appId: runtimeConfig.public.firebaseAppId as string,
	}

	let app
	if (!getApps().length) {
		app = initializeApp(firebaseConfig)
	} else {
		app = getApp()
	}

	const auth = getAuth(app)
	const db = getFirestore(app)

	nuxtApp.provide('firebaseApp', app)
	nuxtApp.provide('firebaseAuth', auth)
	nuxtApp.provide('firebaseDb', db)
})
