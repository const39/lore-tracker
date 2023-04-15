<template>
	<v-menu location="bottom left">
		<template #activator="{ props }">
			<v-btn icon="mdi-dots-vertical" v-bind="props" />
		</template>

		<v-list density="compact" flat>
			<v-item-group mandatory>
				<!-- Fire a custom event to the parent component. The parent can decide to catch this event to react to the user action. -->
				<v-list-item prepend-icon="mdi-pencil" @click="$emit('edit')">
					<v-list-item-title>{{ $t("actions.edit") }}</v-list-item-title>
				</v-list-item>
				<v-list-item prepend-icon="mdi-delete" @click="$emit('delete')">
					<v-list-item-title>{{ $t("actions.delete") }}</v-list-item-title>
				</v-list-item>
			</v-item-group>
		</v-list>
	</v-menu>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";

defineEmits(["edit", "delete"]);
</script>
