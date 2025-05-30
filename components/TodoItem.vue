<script setup lang="ts">
import type { ITodo } from '~/interfaces/todo'

const props = defineProps<{
	todo: ITodo
}>()

const isComplete = ref(props.todo.isComplete)
const { deleteTodo, updateTodo, isDisabled } = useTodos()
</script>

<template>
	<div class="space-y-4 bg-white p-4 rounded-2xl">
		<div class="flex items-center justify-end gap-3">
			<NuxtLink :to="`/todos/${todo.id}`">
				<UButton class="text-white">
					<UIcon name="lucide:external-link" />
				</UButton>
			</NuxtLink>

			<UButton
				class="text-white"
				color="error"
				:disabled="isDisabled"
				@click="deleteTodo(todo.id)">
				<UIcon name="lucide:trash-2" />
			</UButton>

			<UCheckbox
				v-model="isComplete"
				:disabled="isDisabled"
				size="xl"
				@change="updateTodo(todo.id, { isComplete: isComplete })" />
		</div>

		<div class="space-y-2">
			<div
				class="text-lg font-bold text-black"
				:class="{ 'line-through': isComplete }">
				{{ todo.title }}
			</div>

			<p
				class="text-gray-700 line-clamp-4"
				:class="{ 'line-through': isComplete }">
				{{ todo.description }}
			</p>

			<div
				class="text-sm text-gray-500"
				:class="{
					'text-green-500': isComplete && todo.deadline > Date.now(),
					'text-red-600': !isComplete && todo.deadline < Date.now(),
				}">
				{{ new Date(todo.deadline).toLocaleString() }}
			</div>
		</div>
	</div>
</template>
