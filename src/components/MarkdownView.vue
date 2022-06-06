<template>
	<vue-markdown class="text--primary" :html="false" :source="text" v-bind="$attrs"></vue-markdown>
</template>

<script lang="ts">
import Vue from "vue";
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
