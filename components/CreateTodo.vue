<template>
	<ULink
		to="/todos/new"
		class="flex items-center justify-center p-4 h-60 bg-white rounded-2xl cursor-pointer">
		<div class="space-y-4 text-center">
			<UIcon
				name="i-heroicons-plus"
				class="text-5xl text-green-500 cursor-pointer" />
			<h2 class="text-2xl font-bold text-green-500">Create Todo</h2>
			<p class="text-sm text-gray-500">
				Create a new todo to help you stay organized and on track.
			</p>
		</div>
	</ULink>
</template>
