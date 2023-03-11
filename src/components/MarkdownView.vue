<template>
	<VueMarkdown class="text--primary" :html="false" :source="text" v-bind="$attrs"></VueMarkdown>
</template>

<script lang="ts" setup>
// HACK: Force TS to ignore untyped library because all .d.ts declaration attempts did not work
//@ts-ignore
import VueMarkdown from "@adapttive/vue-markdown";

defineProps<{
	text: string;
}>();
</script>
