<script setup lang="ts">
const toast = useToast()
const userStore = useUserStore()

const authWithProvider = async (name: 'google' | 'facebook') => {
	try {
		await userStore.loginWithProvider(name)
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
			class="flex-1"
			variant="outline"
			@click="authWithProvider('google')">
			<img
				src="/images/google.png"
				alt="Google"
				class="w-4 h-4" />
			Google
		</UButton>

		<UButton
			type="button"
			class="flex-1"
			variant="outline"
			@click="authWithProvider('facebook')">
			<img
				src="/images/facebook.webp"
				alt="Facebook"
				class="w-4 h-4" />
			Facebook
		</UButton>
	</div>
</template>
