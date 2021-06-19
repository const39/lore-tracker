<template>
	<vue-markdown class="text--primary" :html="false" :source="text" v-bind="$attrs"></vue-markdown>
</template>

<script>
import VueMarkdown from "@adapttive/vue-markdown";

export default {
    props: {
        text: String
    },
    components: {
        'vue-markdown': VueMarkdown
    }
}
</script>