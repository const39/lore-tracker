<template>
	<v-dialog v-model="showDialog" max-width="850px">
		<v-card>
			<v-card-title>{{ $t("options.hotkeys.title") }}</v-card-title>
			<v-card-text>
				<v-row class="d-flex">
					<v-col cols="12" md="6">
						<HotkeyList :title="$t('options.hotkeys.pages.title')" :hotkeys="hotkeysDisplay.pages" />
						<HotkeyList :title="$t('options.hotkeys.misc.title')" :hotkeys="hotkeysDisplay.misc" />
					</v-col>
					<v-col cols="12" md="6">
						<HotkeyList :title="$t('options.hotkeys.content.title')" :hotkeys="hotkeysDisplay.content" />
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn text color="primary" @click="showDialog = false">{{ $t("actions.close") }}</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import HotkeyList from "../hotkeys/HotkeyList.vue";

export default Vue.extend({
	components: {
		HotkeyList,
	},
	props: {
		value: Boolean, // Default v-model overwrite
	},
	data() {
		return {
			hotkeysDisplay: {
				pages: [
					{
						text: this.$t("options.hotkeys.pages.toHome"),
						command: "F1",
					},
					{
						text: this.$t("options.hotkeys.pages.toTimeline"),
						command: "F2",
					},
				],
				content: [
					{
						text: this.$t("options.hotkeys.content.showTabObjective"),
						command: "Alt+1",
					},
					{
						text: this.$t("options.hotkeys.content.showTabEvent"),
						command: "Alt+2",
					},
					{
						text: this.$t("options.hotkeys.content.showTabLocation"),
						command: "Alt+3",
					},
					{
						text: this.$t("options.hotkeys.content.showTabCharacter"),
						command: "Alt+4",
					},
					{
						text: this.$t("options.hotkeys.content.showTabNote"),
						command: "Alt+5",
					},
				],
				misc: [
					{
						text: this.$t("options.hotkeys.misc.openSearch"),
						command: "Ctrl+K",
					},
					{
						text: this.$t("options.hotkeys.misc.openOptions"),
						command: "ESC",
					},
				],
			},
		};
	},
	computed: {
		/**
		 * Overwrite default v-model to bind the ObjectiveForm v-model attribute to the v-dialog one.
		 * This allows to use a custom component as an external activator for the v-dialog.
		 * @see https://vuejs.org/v2/guide/components-custom-events.html#Customizing-Component-v-model
		 */
		showDialog: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit("input", value);
			},
		},
	},
});
</script>
