<template>
	<v-menu location="bottom left">
		<template #activator="{ props }">
			<v-btn icon="mdi-dots-vertical" density="comfortable" v-bind="props" />
		</template>

		<v-list density="compact">
			<v-list-item
				:title="$t('actions.edit')"
				prepend-icon="mdi-pencil"
				@click="$emit('edit')"
			/>
			<v-list-item
				:title="$t('actions.delete')"
				prepend-icon="mdi-delete"
				@click="$emit('delete')"
			/>
			<v-list-item
				:title="$t('actions.moveTo')"
				prepend-icon="mdi-folder-move"
				@click="$emit('move')"
			/>
		</v-list>
	</v-menu>
</template>

<script lang="ts" setup>
import { t as $t } from "@/core/translation";

defineEmits(["edit", "delete", "move"]);
</script>
