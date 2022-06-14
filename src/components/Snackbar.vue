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

<script lang="ts">
import { eventHub, SnackbarEvent } from "@/js/eventHub";
import Vue from "vue";

export default Vue.extend({
	data() {
		return {
			show: false,
			message: "",
			timeout: -1,
			color: "primary",
		};
	},
	created() {
		eventHub.$on("snackbar", (e: SnackbarEvent) => {
			this.message = e.message;
			this.timeout = e.timeout;
			this.color = e.color;
			this.show = true;
		});
	},
});
</script>

<style></style>
