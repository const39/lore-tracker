<template>
	<v-snackbar v-model="show" :timeout="timeout" :color="color">
		{{ message }}
		<template v-slot:actions>
			<v-btn icon @click="show = false">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</template>
	</v-snackbar>
</template>

<script lang="ts" setup>
import { eventBus } from "@/js/eventBus.js";
import { ref, onMounted, onBeforeUnmount } from "vue";

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

<style></style>
