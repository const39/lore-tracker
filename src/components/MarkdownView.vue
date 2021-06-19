<template>
	<vue-markdown class="text--primary" :html="false" :source="text"></vue-markdown>
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