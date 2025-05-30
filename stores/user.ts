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

import type { Auth } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'
import type { IUser } from '~/interfaces/user'

export const useUserStore = defineStore('userStore', {
	state: () => ({
		user: null as IUser | null,
		loading: true,
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

			const { $firebaseDb } = useNuxtApp()
			const docRef = doc($firebaseDb as Firestore, 'users', id)
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

			const { $firebaseAuth, $firebaseDb } = useNuxtApp()
			const userCredential = await signInWithEmailAndPassword(
				$firebaseAuth as Auth,
				email,
				password,
			)

			const user = await getDoc(
				doc($firebaseDb as Firestore, 'users', userCredential.user.uid),
			)
			this.user = user.data() as IUser
		},
		async register(displayName: string, email: string, password: string) {
			this.loading = true

			const { $firebaseAuth, $firebaseDb } = useNuxtApp()
			const userCredential = await createUserWithEmailAndPassword(
				$firebaseAuth as Auth,
				email,
				password,
			)

			await setDoc(
				doc($firebaseDb as Firestore, 'users', userCredential.user.uid),
				{
					id: userCredential.user.uid,
					displayName,
					email,
					todos: [],
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			)
		},
		async logout() {
			this.loading = true

			const { $firebaseAuth } = useNuxtApp()
			await signOut($firebaseAuth as Auth)

			this.user = null
			this.loading = false
		},
		async loginWithProvider(name: 'google' | 'facebook') {
			this.loading = true

			const { $firebaseAuth, $firebaseDb } = useNuxtApp()

			const provider =
				name === 'google'
					? new GoogleAuthProvider()
					: new FacebookAuthProvider()
			const userCredential = await signInWithPopup(
				$firebaseAuth as Auth,
				provider,
			)

			const docRef = doc(
				$firebaseDb as Firestore,
				'users',
				userCredential.user.uid,
			)
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
