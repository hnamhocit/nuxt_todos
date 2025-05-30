<script setup lang="ts">
useSeoMeta({
	title: 'NUXT TODOS',
	ogTitle: 'NUXT TODOS',
	description:
		'A simple todo realtime app built with Nuxt 3, TailwindCss, Firebase',
	ogDescription:
		'A simple todo realtime app built with Nuxt 3, TailwindCss, Firebase',
	ogImage: 'https://nuxt-todos-omega.vercel.app/images/logo.png',
	twitterCard: 'summary_large_image',
})
</script>

<template>
	<NuxtRouteAnnouncer />

	<AppAuthenticate>
		<UApp>
			<NuxtLayout>
				<NuxtPage />
			</NuxtLayout>
		</UApp>
	</AppAuthenticate>
</template>
