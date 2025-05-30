<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { doc, getDoc } from 'firebase/firestore'
import moment from 'moment'
import { z } from 'zod'
import { db } from '~/config/firebase'
import type { ITodo } from '~/interfaces/todo'

const route = useRoute()
const id = route.query.id as string | undefined

const toast = useToast()

const { createTodo, isDisabled, updateTodo } = useTodos()

const schema = z.object({
	title: z.string().nonempty('Title cannot be empty.'),
	description: z.string().nonempty('Description cannot be empty.'),
	deadline: z.string().transform((str, ctx) => {
		const date = moment(str, 'YYYY-MM-DDTHH:mm')
		if (!date.isValid()) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Invalid deadline format. Expected YYYY-MM-DDTHH:mm',
			})
			return z.NEVER
		}

		const timestamp = date.valueOf()
		if (timestamp < Date.now()) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Deadline must be in the future.',
			})
			return z.NEVER
		}

		return timestamp
	}),
})

const { data: todo, pending } = useAsyncData<ITodo | null>('todo', async () => {
	if (!id) {
		return null
	}

	const docRef = doc(db, 'todos', id)
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

type Values = z.infer<typeof schema>

const state = reactive({
	title: '',
	description: '',
	deadline: moment().format('YYYY-MM-DDTHH:mm'),
})

async function onSubmit(event: FormSubmitEvent<Values>) {
	if (id) {
		await updateTodo(id, {
			title: event.data.title,
			description: event.data.description,
			deadline: event.data.deadline,
		})
	} else {
		await createTodo({
			title: event.data.title,
			description: event.data.description,
			deadline: event.data.deadline,
		})

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
			console.log(newTodo)
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

		<div class="flex gap-3">
			<textarea
				v-model="state.description"
				placeholder="Description"
				rows="12"
				class="outline-none block flex-1 bg-transparent resize-none" />

			<MarkdownPreview
				class="flex-1"
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
