<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { FirebaseError } from 'firebase/app'
import { z } from 'zod'

const userStore = useUserStore()

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
})

const toast = useToast()

const state = reactive({
	email: '',
	password: '',
})

type Schema = z.infer<typeof schema>

async function onSubmit(event: FormSubmitEvent<Schema>) {
	try {
		await userStore.login(event.data.email, event.data.password)
		navigateTo('/')
	} catch (error) {
		if (error instanceof FirebaseError) {
			if (error.code === 'auth/invalid-credential') {
				toast.add({
					title: 'Login error',
					description: 'Invalid email or password',
					color: 'error',
				})
				return
			}

			if (error.code === 'auth/user-not-found') {
				toast.add({
					title: 'Login error',
					description: 'User not found',
					color: 'error',
				})
				return
			}
		}
	} finally {
		userStore.setLoading(false)
	}
}
</script>

<template>
	<div class="flex justify-center items-center h-screen">
		<div class="w-full max-w-xs space-y-7">
			<h1 class="text-2xl font-bold text-center">Login</h1>

			<UForm
				:state="state"
				:schema="schema"
				class="space-y-7"
				@submit="onSubmit">
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
					Do not have an account?
					<NuxtLink
						to="/auth/register"
						class="font-semibold text-green-500">
						Register
					</NuxtLink>
				</div>

				<AuthProviders />
			</UForm>
		</div>
	</div>
</template>
