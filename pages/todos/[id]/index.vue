<script setup lang="ts">
import { doc, onSnapshot, type Unsubscribe } from 'firebase/firestore'
import { db } from '~/config/firebase'
import type { ITodo } from '~/interfaces/todo'

const { id } = useRoute().params
const isLoading = ref(true)
let unsubscribe: Unsubscribe | null = null

const todo = ref<ITodo | null>(null)

onMounted(async () => {
	unsubscribe = onSnapshot(doc(db, 'todos', id as string), (doc) => {
		if (!doc.exists()) {
			navigateTo('/')
		}

		todo.value = doc.data() as ITodo
		isLoading.value = false
	})
})

onUnmounted(() => {
	if (unsubscribe) {
		unsubscribe()
	}
})

const { deleteTodo, updateTodo, isDisabled } = useTodos()
</script>

<template>
	<LoadingSpinner v-if="isLoading" />
	<div
		v-else-if="todo"
		class="space-y-7 p-4">
		<div class="flex items-center justify-between">
			<div class="space-y-2">
				<div class="text-5xl font-bold text-green-500">
					{{ todo.title }}
				</div>

				<div class="flex items-center gap-3">
					<div
						:class="{
							'text-green-500': todo.isComplete,
							'text-red-500': !todo.isComplete,
						}">
						{{ todo.isComplete ? 'Completed' : 'Not Completed' }}
					</div>

					<div>-</div>

					<div class="text-gray-500">
						Deadline:
						{{ new Date(todo.deadline).toLocaleDateString() }}
					</div>
				</div>
			</div>

			<div class="flex items-center gap-3">
				<UCheckbox
					v-model="todo.isComplete"
					:disabled="isDisabled"
					size="xl"
					@change="
						updateTodo(todo.id, { isComplete: todo.isComplete })
					" />

				<ULink
					:to="`/todos/new?id=${id}`"
					class="text-white"
					color="success"
					size="xl">
					<UButton
						:disabled="isDisabled"
						class="text-white"
						color="success"
						size="xl">
						<UIcon name="lucide:pencil" />
					</UButton>
				</ULink>

				<UButton
					:disabled="isDisabled"
					class="text-white"
					color="error"
					size="xl"
					@click="deleteTodo(todo.id)">
					<UIcon name="lucide:trash-2" />
				</UButton>
			</div>
		</div>

		<MarkdownPreview :markdown="todo.description" />
	</div>
</template>
