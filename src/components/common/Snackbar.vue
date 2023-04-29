<template>
	<v-snackbar v-model="show" :timeout="timeout" :color="color">
		{{ message }}
		<template #actions>
			<v-btn icon="mdi-close" @click="show = false" />
		</template>
	</v-snackbar>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { eventBus } from "@/core/eventBus.js";

const show = ref(false);
const message = ref("");
const timeout = ref(-1);
const color = ref("primary");

onMounted(() => {
	eventBus.on("show-snackbar", (e) => {
		message.value = e.message;
		timeout.value = e.timeout;
		color.value = e.color;
		show.value = true;
	});
});

onBeforeUnmount(() => {
	eventBus.off("show-snackbar");
});
</script>
