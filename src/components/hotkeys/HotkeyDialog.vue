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
import { Category } from "@/core/models";
import { t as $t } from "@/core/translation";
import HotkeyList from "../hotkeys/HotkeyList.vue";

const showDialog = defineModel<boolean>({ required: true }); // v-model

const hotkeysDisplay = {
	content: Object.values(Category).map((category, idx) => {
		return {
			text: $t("options.hotkeys.content.showTab", {
				category: $t(`data.categories.${category}`),
			}),
			command: `Alt+${idx + 1}`,
		};
	}),
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
