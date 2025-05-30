<script setup lang="ts">
const { todos, isLoading } = useTodos()

const filteredTodos = computed(() => {
	return todos.value.filter(
		(todo) =>
			todo.title.toLowerCase().includes(search.value.toLowerCase()) ||
			todo.description.toLowerCase().includes(search.value.toLowerCase()),
	)
})

const search = ref('')
</script>

<template>
	<LoadingSpinner v-if="isLoading" />
	<div
		v-else
		class="p-7 space-y-7">
		<div class="flex justify-center">
			<UInput
				v-model="search"
				icon="lucide:search"
				placeholder="Search"
				size="xl" />
		</div>

		<div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			<CreateTodo />

			<TodoItem
				v-for="todo in filteredTodos"
				:key="todo.id"
				:todo="todo" />
		</div>
	</div>
</template>
