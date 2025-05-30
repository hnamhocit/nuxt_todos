<script setup lang="ts">
const userStore = useUserStore()
</script>

<template>
	<div
		class="sticky top-0 left-0 w-full h-16 z-50 bg-white px-4 flex items-center justify-between">
		<div class="flex items-center gap-3">
			<NuxtLink to="/">
				<img
					src="/images/logo.png"
					alt="Nuxt Todo"
					class="w-10 h-10" />
			</NuxtLink>

			<h1 class="hidden md:block text-2xl font-bold text-green-500">
				Nuxt Todos
			</h1>
		</div>

		<div
			v-if="userStore.user"
			class="flex items-center gap-5">
			<div class="text-sm text-gray-500 hidden md:block">
				Hi,
				<span class="font-semibold text-green-500">{{
					userStore.user.displayName
				}}</span>
			</div>

			<NuxtLink to="/how-to-delete-data">
				<UIcon
					name="material-symbols:help-rounded"
					class="text-gray-700 text-xl" />
			</NuxtLink>

			<NuxtLink to="/privacy-and-policy">
				<UIcon
					name="material-symbols:book-2"
					class="text-gray-700 text-xl" />
			</NuxtLink>

			<UButton
				color="error"
				@click="userStore.logout">
				Logout
			</UButton>
		</div>
		<div
			v-else
			class="flex items-center gap-3">
			<UButton variant="outline"> Login </UButton>
			<UButton> Register </UButton>
		</div>
	</div>
</template>
