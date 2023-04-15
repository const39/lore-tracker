<template>
	<div class="d-flex flex-column">
		<v-btn
			:disabled="disabled"
			class="mx-2 my-1"
			prepend-icon="mdi-plus"
			@click="$emit('new-folder')"
		>
			{{ $t("notepad.types.folder") }}
		</v-btn>
		<v-btn
			:disabled="disabled"
			class="mx-2 my-1"
			prepend-icon="mdi-plus"
			@click="$emit('new-file')"
		>
			{{ $t("notepad.types.file") }}
		</v-btn>
	</div>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
defineProps<{ disabled: boolean }>();
defineEmits(["new-folder", "new-file"]);
</script>
