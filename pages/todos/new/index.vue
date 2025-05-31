<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Firestore } from 'firebase/firestore'
import { doc, getDoc } from 'firebase/firestore'
import moment from 'moment'
import { z } from 'zod'
import type { ITodo } from '~/interfaces/todo'

const route = useRoute()
const id = route.query.id as string | undefined
const { $firebaseDb } = useNuxtApp()

const toast = useToast()

const { createTodo, isDisabled, updateTodo } = useTodos()

const schema = z.object({
	title: z.string().nonempty('Title cannot be empty.'),
	description: z.string().nonempty('Description cannot be empty.'),
	// Remove deadline validation from schema
	deadline: z.string(), // Keep it as a string for initial input
})

const { data: todo, pending } = useAsyncData<ITodo | null>('todo', async () => {
	if (!id) {
		return null
	}

	const docRef = doc($firebaseDb as Firestore, 'todos', id)
	const docSnap = await getDoc(docRef)

	if (!docSnap.exists()) {
		toast.add({
			title: 'Error',
			description: 'Todo not found, please check id and try again',
			color: 'error',
		})
		navigateTo('/')
	}

	return docSnap.data() as ITodo
})

type Values = z.infer<typeof schema> & { deadline: string } // Adjust type to include string deadline

const state = reactive({
	title: '',
	description: '',
	deadline: moment().format('YYYY-MM-DDTHH:mm'),
})

async function onSubmit(event: FormSubmitEvent<Values>) {
	console.log('Form data before deadline processing:', event.data)

	// Handle deadline conversion and validation outside the schema
	const date = moment(event.data.deadline, 'YYYY-MM-DDTHH:mm')
	if (!date.isValid()) {
		toast.add({
			title: 'Error',
			description: 'Invalid deadline format. Expected YYYY-MM-DDTHH:mm',
			color: 'error',
		})
		return // Stop submission if invalid
	}

	const timestamp = date.valueOf()
	if (timestamp < Date.now()) {
		toast.add({
			title: 'Error',
			description: 'Deadline must be in the future.',
			color: 'error',
		})
		return // Stop submission if in the past
	}

	// Now event.data.deadline is the number (timestamp)
	const todoData = {
		title: event.data.title,
		description: event.data.description,
		deadline: timestamp,
	}

	if (id) {
		await updateTodo(id, todoData)
	} else {
		await createTodo(todoData)
		reset()
	}

	toast.add({
		title: 'Success',
		description: `Todo ${id ? 'updated' : 'added'} successfully`,
		color: 'success',
	})
}

const reset = () => {
	state.title = ''
	state.description = ''
	state.deadline = moment().format('YYYY-MM-DDTHH:mm')
}

watch(
	todo,
	(newTodo) => {
		if (newTodo) {
			state.title = newTodo.title
			state.description = newTodo.description
			state.deadline = moment(newTodo.deadline).format('YYYY-MM-DDTHH:mm')
		}
	},
	{ immediate: true },
)
</script>

<template>
	<LoadingSpinner v-if="pending" />
	<UForm
		v-else
		:schema="schema"
		:state="state"
		class="flex flex-col gap-7 p-7"
		@submit="onSubmit">
		<textarea
			v-model="state.title"
			placeholder="Title"
			class="outline-none text-5xl font-bold block bg-transparent resize-none" />

		<div class="flex flex-col gap-3">
			<textarea
				v-model="state.description"
				placeholder="Description"
				rows="12"
				class="outline-none block w-full bg-transparent resize-none" />

			<MarkdownPreview
				class="overflow-hidden w-full"
				:markdown="state.description" />
		</div>

		<UInput
			v-model="state.deadline"
			type="datetime-local"
			placeholder="Deadline" />

		<div class="flex items-center gap-3 justify-end">
			<UButton
				:disabled="isDisabled"
				type="button"
				color="error"
				@click="reset">
				Reset
			</UButton>

			<UButton
				type="submit"
				:disabled="isDisabled">
				{{ id ? 'Update' : 'Add' }} Todo
			</UButton>
		</div>
	</UForm>
</template>
