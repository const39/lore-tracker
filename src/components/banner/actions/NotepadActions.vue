<template>
	<div class="d-flex flex-column">
		<v-btn :disabled="disabled" class="mx-2 my-1" @click="$emit('new-folder')">
			<v-icon left>mdi-plus</v-icon>
			{{ $t("notepad.types.folder") }}
		</v-btn>
		<v-btn :disabled="disabled" class="mx-2 my-1" @click="$emit('new-file')">
			<v-icon left>mdi-plus</v-icon>
			{{ $t("notepad.types.file") }}
		</v-btn>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	props: {
		disabled: Boolean,
	},
});
</script>
