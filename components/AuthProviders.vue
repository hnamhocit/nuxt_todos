<script setup lang="ts">
const toast = useToast()
const userStore = useUserStore()

const authWithProvider = async (name: 'google' | 'facebook') => {
	try {
		await userStore.loginWithProvider(name)

		navigateTo('/')
	} catch (error) {
		console.trace(error)
		toast.add({
			title: `Login with ${name.toUpperCase()} error`,
			description:
				error instanceof Error ? error.message : 'Unknown error',
			color: 'error',
		})
	} finally {
		userStore.setLoading(false)
	}
}
</script>

<template>
	<div class="flex items-center gap-3">
		<UButton
			type="button"
			icon="mdi:google"
			class="flex-1"
			@click="authWithProvider('google')">
			Google
		</UButton>

		<UButton
			type="button"
			icon="ic:baseline-facebook"
			class="flex-1"
			@click="authWithProvider('facebook')">
			Facebook
		</UButton>
	</div>
</template>
