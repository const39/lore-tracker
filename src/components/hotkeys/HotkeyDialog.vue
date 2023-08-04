<template>
	<v-dialog v-model="showDialog" max-width="850px">
		<v-card>
			<v-card-title>{{ $t("options.hotkeys.title") }}</v-card-title>
			<v-card-text>
				<v-row class="d-flex">
					<v-col cols="12" md="6">
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
import { t as $t } from "@/core/translation";
import HotkeyList from "../hotkeys/HotkeyList.vue";

const showDialog = defineModel<boolean>({ required: true }); // v-model

const hotkeysDisplay = {
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
			text: $t("actions.dragSort"),
			command: "Ctrl+Alt",
			hold: true,
		},
		{
			text: $t("options.hotkeys.misc.openOptions"),
			command: "ESC",
		},
	],
};
</script>
