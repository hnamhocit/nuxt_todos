<script setup lang="ts">
const userStore = useUserStore()

const authWithProvider = async (name: 'google' | 'facebook') =>
	await userStore.loginWithProvider(name)
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
