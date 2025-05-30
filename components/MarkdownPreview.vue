<script setup lang="ts">
import MarkdownIt from 'markdown-it'

const props = defineProps<{
	markdown: string
}>()

const md = new MarkdownIt({
	html: true,
	linkify: true,
	typographer: true,
})

const renderedMarkdown = ref('')

watchEffect(() => {
	if (props.markdown) {
		renderedMarkdown.value = md.render(props.markdown)
	} else {
		renderedMarkdown.value = '<p>No description</p>'
	}
})
</script>

<template>
	<div
		class="markdown-body space-y-4"
		v-html="renderedMarkdown"></div>
</template>
