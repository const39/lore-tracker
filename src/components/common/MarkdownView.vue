<template>
	<VueMarkdown :source="text" class="markdown" />
</template>

<script lang="ts" setup>
import VueMarkdown from "vue-markdown-render";

defineProps<{
	text: string;
}>();
</script>

<style>
.markdown * {
	margin-top: 8px;
	margin-bottom: 12px;
}

.markdown li {
	margin: 0 0 0 16px;
}
</style>
