import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: 'AIzaSyBKI0pWFVcEdxH-KJjVmTKTlPlxemAXDs0',
	authDomain: 'nuxt-todos-e0512.firebaseapp.com',
	projectId: 'nuxt-todos-e0512',
	storageBucket: 'nuxt-todos-e0512.firebasestorage.app',
	messagingSenderId: '377095796736',
	appId: '1:377095796736:web:5a19ace0a9ecbae38440e5',
}

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
const auth = getAuth(app)

export { app, auth, db }
