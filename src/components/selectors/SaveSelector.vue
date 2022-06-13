<template>
	<div>
		<SelectorActivator :title="$t('options.save.optionName')" icon="mdi-content-save">
			<v-list dense>
				<v-list-item-group>
					<v-list-item @click="downloadSave">
						<v-list-item-icon>
							<v-icon>mdi-download</v-icon>
						</v-list-item-icon>
						<v-list-item-title>{{ $t("options.save.downloadText") }}</v-list-item-title>
					</v-list-item>
					<v-list-item @click="showUploadDialog = true">
						<v-list-item-icon>
							<v-icon>mdi-upload</v-icon>
						</v-list-item-icon>
						<v-list-item-title>{{ $t("options.save.uploadText") }}</v-list-item-title>
					</v-list-item>
					<v-list-item @click="showConfirmDialog = true">
						<v-list-item-icon>
							<v-icon color="red">mdi-delete</v-icon>
						</v-list-item-icon>
						<v-list-item-title class="red--text">
							{{ $t("options.save.deleteText") }}
						</v-list-item-title>
					</v-list-item>
				</v-list-item-group>
			</v-list>
		</SelectorActivator>

		<!-- Save file upload dialog -->
		<v-dialog v-model="showUploadDialog" persistent max-width="450">
			<v-card>
				<v-card-title class="text-h5">{{ $t("options.save.uploadText") }}</v-card-title>
				<v-card-text>
					<v-file-input
						v-model="uploadedFile"
						outlined
						accept="application/json"
						:label="$t('options.save.uploadInputLabel')"
						:messages="$t('options.save.uploadInputHint')"
					></v-file-input>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn text color="primary" @click="showUploadDialog = false">{{ $t("actions.close") }}</v-btn>
					<v-btn text class="text--primary" @click="uploadSave">{{ $t("actions.save") }}</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Delete confirmation dialog -->
		<ConfirmDialog
			v-model="showConfirmDialog"
			:title="$t('options.save.deleteDialogTitle')"
			:message="$t('options.save.deleteDialogMessage')"
			:acceptAction="deleteSave"
		/>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

import ConfirmDialog from "@/components/ConfirmDialog.vue";
import SelectorActivator from "./SelectorActivator.vue";

export default Vue.extend({
	components: {
		ConfirmDialog,
		SelectorActivator,
	},
	data() {
		return {
			uploadedFile: undefined as File | undefined,
			showUploadDialog: false,
			showConfirmDialog: false,
		};
	},
	methods: {
		downloadSave() {
			const a = document.createElement("a");
			const json = this.$store.getters.getJsonData;
			const blob = new Blob([json], { type: "application/json" });
			a.href = URL.createObjectURL(blob);
			a.download = `LoreTracker_backup_${new Date().toLocaleDateString()}.json`;
			a.click();
		},
		uploadSave() {
			if (this.uploadedFile) {
				this.uploadedFile.text().then((value) => {
					this.$store.commit("loadData", value);
					this.$store.dispatch("save");
					this.uploadedFile = undefined;
					this.showUploadDialog = false;
				});
				// .catch((err) => {});
				// TODO error management
			}
		},
		deleteSave() {
			this.$store.commit("resetState");
			this.$store.dispatch("deleteSave");
		},
	},
});
</script>

<style></style>
