<template>
	<v-menu bottom left>
		<template v-slot:activator="{ props }">
			<v-btn icon v-bind="props">
				<v-icon>mdi-dots-vertical</v-icon>
			</v-btn>
		</template>

		<v-list dense flat>
			<v-item-group mandatory>
				<!-- Fire a custom event to the parent component. The parent can decide to catch this event to react to the user action. -->
				<v-list-item @click="$emit('edit')">
					<v-list-item-icon>
						<v-icon>mdi-pencil</v-icon>
					</v-list-item-icon>
					<v-list-item-title>{{ $t("actions.edit") }}</v-list-item-title>
				</v-list-item>
				<v-list-item @click="$emit('delete')">
					<v-list-item-icon>
						<v-icon>mdi-delete</v-icon>
					</v-list-item-icon>
					<v-list-item-title>{{ $t("actions.delete") }}</v-list-item-title>
				</v-list-item>
			</v-item-group>
		</v-list>
	</v-menu>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
</script>

<style></style>
