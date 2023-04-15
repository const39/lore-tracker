<template>
	<v-card elevation="0">
		<v-card-title class="pa-2 text-overline">{{ title }}</v-card-title>
		<v-card-text class="pa-2">
			<HotkeyElement v-for="hotkey in hotkeys" :key="hotkey.key" v-bind="hotkey" />
		</v-card-text>
	</v-card>
</template>

<script lang="ts" setup>
import HotkeyElement from "./HotkeyElement.vue";

defineProps<{
	hotkeys: InstanceType<typeof HotkeyElement>["$props"][];
	title: string;
}>();
</script>
