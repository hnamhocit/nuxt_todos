<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { FirebaseError } from 'firebase/app'
import { z } from 'zod'

defineProps<{
	onClick: () => void
}>()

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
			<div class="flex justify-center">
				<img
					src="/images/logo.png"
					alt="Logo"
					class="w-24 h-24" />
			</div>

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
					Login
				</UButton>

				<div class="text-center">
					Do not have an account?
					<UButton
						@click="onClick"
						variant="ghost">
						Register
					</UButton>
				</div>

				<AuthProviders />
			</UForm>
		</div>
	</div>
</template>
