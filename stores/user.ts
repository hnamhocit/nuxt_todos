import {
	createUserWithEmailAndPassword,
	FacebookAuthProvider,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { auth, db } from '~/config/firebase'

import type { IUser } from '~/interfaces/user'

export const useUserStore = defineStore('userStore', {
	state: () => ({
		user: null as IUser | null,
		loading: false,
	}),
	actions: {
		setLoading(loading: boolean) {
			this.loading = loading
		},
		setUser(user: IUser | null) {
			this.user = user
		},
		async getMe(id: string) {
			this.loading = true

			const docRef = doc(db, 'users', id)
			const snapshot = await getDoc(docRef)

			if (!snapshot.exists()) {
				this.loading = false
				return
			}

			this.user = snapshot.data() as IUser
			this.loading = false
		},
		async login(email: string, password: string) {
			this.loading = true

			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password,
			)

			const user = await getDoc(doc(db, 'users', userCredential.user.uid))
			this.user = user.data() as IUser
		},
		async register(displayName: string, email: string, password: string) {
			this.loading = true

			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password,
			)

			await setDoc(doc(db, 'users', userCredential.user.uid), {
				id: userCredential.user.uid,
				displayName,
				email,
				todos: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			})
		},
		async logout() {
			this.loading = true
			await signOut(auth)
			this.user = null
			this.loading = false
		},
		async loginWithProvider(name: 'google' | 'facebook') {
			this.loading = true

			const provider =
				name === 'google'
					? new GoogleAuthProvider()
					: new FacebookAuthProvider()
			const userCredential = await signInWithPopup(auth, provider)

			const docRef = doc(db, 'users', userCredential.user.uid)
			const snapshot = await getDoc(docRef)

			if (!snapshot.exists()) {
				await setDoc(docRef, {
					id: userCredential.user.uid,
					displayName: userCredential.user.displayName,
					email: userCredential.user.email,
					todos: [],
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				return
			}

			this.user = snapshot.data() as IUser
		},
	},
})
