<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

const userStore = useUserStore()

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	displayName: z.string().nonempty(),
})

const toast = useToast()

const state = reactive({
	email: '',
	password: '',
	displayName: '',
})

type Schema = z.infer<typeof schema>

async function onSubmit(event: FormSubmitEvent<Schema>) {
	try {
		await userStore.register(
			event.data.displayName,
			event.data.email,
			event.data.password,
		)
		navigateTo('/')
	} catch (error) {
		console.trace(error)
		toast.add({
			title: 'Register error',
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
	<div class="flex justify-center items-center h-screen">
		<div class="w-full max-w-xs space-y-7">
			<h1 class="text-2xl font-bold text-center">Register</h1>

			<UForm
				:state="state"
				:schema="schema"
				class="space-y-7"
				@submit="onSubmit">
				<UFormField
					label="Display Name"
					name="displayName">
					<UInput
						v-model="state.displayName"
						class="w-full" />
				</UFormField>

				<UFormField
					label="Email"
					name="email">
					<UInput
						v-model="state.email"
						class="w-full" />
				</UFormField>

				<UFormField
					label="Password"
					name="password">
					<UInput
						v-model="state.password"
						class="w-full" />
				</UFormField>

				<UButton
					class="w-full justify-center"
					type="submit">
					Continue
				</UButton>

				<div class="text-center">
					Already have an account?
					<NuxtLink
						to="/auth/login"
						class="font-semibold text-green-500">
						Login
					</NuxtLink>
				</div>

				<AuthProviders />
			</UForm>
		</div>
	</div>
</template>
