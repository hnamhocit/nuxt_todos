<script setup lang="ts">
import { onAuthStateChanged, type Unsubscribe } from 'firebase/auth'
import { auth } from '~/config/firebase'

const userStore = useUserStore()
let unsubscribe: Unsubscribe | null = null

onMounted(() => {
	unsubscribe = onAuthStateChanged(auth, (user) => {
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
	<slot v-else />
</template>
