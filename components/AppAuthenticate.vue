<script setup lang="ts">
import { onAuthStateChanged, type Auth, type Unsubscribe } from 'firebase/auth'

const userStore = useUserStore()
const { $firebaseAuth } = useNuxtApp()
let unsubscribe: Unsubscribe | null = null

onMounted(() => {
	unsubscribe = onAuthStateChanged($firebaseAuth as Auth, (user) => {
		if (user) {
			userStore.getMe(user.uid)
		} else {
			userStore.setLoading(false)
		}
	})
})

onUnmounted(() => {
	if (unsubscribe) {
		unsubscribe()
	}
})
</script>

<template>
	<LoadingSpinner v-if="userStore.loading" />
	<Auth v-else-if="!userStore.loading && !userStore.user" />
	<slot v-else />
</template>
