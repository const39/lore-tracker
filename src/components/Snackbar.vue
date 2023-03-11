<template>
	<v-snackbar v-model="show" :timeout="timeout" :color="color">
		{{ message }}
		<template v-slot:action="{ attrs }">
			<v-btn icon v-bind="attrs" @click="show = false">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</template>
	</v-snackbar>
</template>

<script lang="ts" setup>
import { SnackbarEvent, useEventHub } from "@/js/eventHub";
import { ref, onMounted, onBeforeUnmount } from "vue";

const show = ref(false);
const message = ref("");
const timeout = ref(-1);
const color = ref("primary");

const eventHub = useEventHub();

onMounted(() => {
	eventHub.on(SnackbarEvent.ID, (e: SnackbarEvent) => {
		message.value = e.message;
		timeout.value = e.timeout;
		color.value = e.color;
		show.value = true;
	});
});

onBeforeUnmount(() => {
	eventHub.off(SnackbarEvent.ID);
});
</script>

<style></style>
