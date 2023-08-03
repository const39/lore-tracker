<template>
	<v-menu location="bottom left">
		<template #activator="{ props }">
			<v-btn icon="mdi-dots-vertical" variant="text" density="comfortable" v-bind="props" />
		</template>

		<v-list density="compact">
			<slot>
				<v-list-item
					v-if="!options || options.includes('show-related')"
					:title="$t('actions.showRelated')"
					prepend-icon="mdi-tag-multiple"
					@click="$emit('show-related')"
				/>
				<v-divider class="my-1" />
				<v-list-item
					v-if="!options || options.includes('edit')"
					:title="$t('actions.edit')"
					prepend-icon="mdi-pencil"
					@click="$emit('edit')"
				/>
				<v-list-item
					v-if="!options || options.includes('delete')"
					:title="$t('actions.delete')"
					prepend-icon="mdi-delete"
					@click="$emit('delete')"
				/>
				<v-list-item
					v-if="!options || options.includes('move')"
					:title="$t('actions.moveTo')"
					prepend-icon="mdi-folder-move"
					@click="$emit('move')"
				/>
			</slot>
		</v-list>
	</v-menu>
</template>

<script lang="ts" setup>
import { t as $t } from "@/core/translation";

defineProps<{
	options?: Array<"show-related" | "edit" | "delete" | "move">;
}>();

defineEmits(["show-related", "edit", "delete", "move"]);
</script>
