<template>
	<vue-markdown class="text--primary" :html="false" :source="text" v-bind="$attrs"></vue-markdown>
</template>

<script lang="ts">
import Vue from "vue";
// HACK: Force TS to ignore untyped library because all .d.ts declaration attempts did not work 
//@ts-ignore
import VueMarkdown from "@adapttive/vue-markdown";

export default Vue.extend({
	props: {
		text: String,
	},
	components: {
		"vue-markdown": VueMarkdown,
	},
});
</script>
