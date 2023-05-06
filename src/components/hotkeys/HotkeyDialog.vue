<template>
	<v-dialog v-model="showDialog" max-width="850px">
		<v-card>
			<v-card-title>{{ $t("options.hotkeys.title") }}</v-card-title>
			<v-card-text>
				<v-row class="d-flex">
					<v-col cols="12" md="6">
						<HotkeyList
							:title="$t('options.hotkeys.pages.title')"
							:hotkeys="hotkeysDisplay.pages"
						/>
						<HotkeyList
							:title="$t('options.hotkeys.misc.title')"
							:hotkeys="hotkeysDisplay.misc"
						/>
					</v-col>
					<v-col cols="12" md="6">
						<HotkeyList
							:title="$t('options.hotkeys.content.title')"
							:hotkeys="hotkeysDisplay.content"
						/>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn variant="text" color="primary" @click="showDialog = false">
					{{ $t("actions.close") }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { t as $t } from "@/core/translation";
import HotkeyList from "../hotkeys/HotkeyList.vue";

const props = defineProps<{
	modelValue: boolean; // Default v-model overwrite
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: boolean): void;
}>();

const hotkeysDisplay = {
	pages: [
		{
			text: $t("options.hotkeys.pages.toLoreBook"),
			command: "F1",
		},
		{
			text: $t("options.hotkeys.pages.toTimeline"),
			command: "F2",
		},
	],
	content: [
		{
			text: $t("options.hotkeys.content.showTabQuest"),
			command: "Alt+1",
		},
		{
			text: $t("options.hotkeys.content.showTabEvent"),
			command: "Alt+2",
		},
		{
			text: $t("options.hotkeys.content.showTabLocation"),
			command: "Alt+3",
		},
		{
			text: $t("options.hotkeys.content.showTabCharacter"),
			command: "Alt+4",
		},
		{
			text: $t("options.hotkeys.content.showTabFaction"),
			command: "Alt+5",
		},
		{
			text: $t("options.hotkeys.content.showTabNote"),
			command: "Alt+6",
		},
	],
	misc: [
		{
			text: $t("options.hotkeys.misc.openSearch"),
			command: "Ctrl+K",
		},
		{
			text: $t("options.hotkeys.misc.openOptions"),
			command: "ESC",
		},
	],
};

/**
 * Overwrite default v-model to bind the QuestForm v-model attribute to the v-dialog one.
 * This allows to use a custom component as an external activator for the v-dialog.
 * @see https://vuejs.org/v2/guide/components-custom-events.html#Customizing-Component-v-model
 */
const showDialog = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});
</script>
