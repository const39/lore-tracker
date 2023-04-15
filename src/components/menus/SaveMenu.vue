<template>
	<MenuActivator
		:close-on-content-click="false"
		:title="$t('options.save.optionName')"
		icon="mdi-content-save"
	>
		<v-list density="compact">
			<v-list-item prepend-icon="mdi-download" @click="downloadSave">
				<v-list-item-title>{{ $t("options.save.downloadText") }}</v-list-item-title>
			</v-list-item>
			<v-list-item prepend-icon="mdi-upload" @click="showUploadDialog = true">
				<v-list-item-title>{{ $t("options.save.uploadText") }}</v-list-item-title>
			</v-list-item>
			<v-list-item prepend-icon="" @click="showConfirmDialog = true">
				<template #prepend>
					<v-icon color="red" icon="mdi-delete" />
				</template>
				<v-list-item-title class="text-red">
					{{ $t("options.save.deleteText") }}
				</v-list-item-title>
			</v-list-item>
		</v-list>
	</MenuActivator>

	<!-- Save file upload dialog -->
	<v-dialog v-model="showUploadDialog" max-width="450" persistent>
		<v-card>
			<v-card-title class="text-h5">
				{{ $t("options.save.uploadText") }}
			</v-card-title>
			<v-card-text>
				<v-file-input
					v-model="uploadedFile"
					:label="$t('options.save.uploadInputLabel')"
					:messages="$t('options.save.uploadInputHint')"
					variant="outlined"
					accept="application/json"
				/>
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn variant="text" @click="showUploadDialog = false">
					{{ $t("actions.close") }}
				</v-btn>
				<v-btn variant="text" color="primary" @click="uploadSave">
					{{ $t("actions.save") }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>

	<!-- Delete confirmation dialog -->
	<ConfirmDialog
		v-model="showConfirmDialog"
		:title="$t('options.save.deleteDialogTitle')"
		:message="$t('options.save.deleteDialogMessage')"
		:accept-action="deleteSave"
	/>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { ref } from "vue";

import ConfirmDialog from "@/components/ConfirmDialog.vue";
import MenuActivator from "./MenuActivator.vue";
import { eventBus } from "@/js/eventBus";
import { useStore } from "@/store";

const uploadedFile = ref<File[]>([]); // v-file-input only accepts an array of files
const showUploadDialog = ref(false);
const showConfirmDialog = ref(false);

const store = useStore();

function downloadSave(): void {
	const file = store.toFile();
	const a = document.createElement("a");
	a.href = URL.createObjectURL(file);
	a.download = `LoreTracker_backup_${new Date().toLocaleDateString()}.json`;
	a.click();
}

function uploadSave(): void {
	// v-file-input only accepts an array of files, but we do not use the 'multiple' prop
	// so we only use the first element in the array
	if (uploadedFile.value.length) {
		uploadedFile.value[0]
			.text()
			.then((value: string) => {
				try {
					store.loadData(value);
					store.save();
					eventBus.emit("show-snackbar", {
						message: $t("messages.success.saveFileImportSuccessful"),
						timeout: -1,
						color: "success",
					});
				} catch (err) {
					console.error(err);
					const message = `${$t("messages.errors.corruptedSave")} ${$t(
						"messages.errors.saveFileImportCancelled"
					)}`;
					eventBus.emit("show-snackbar", {
						message,
						timeout: -1,
						color: "error",
					});
				} finally {
					uploadedFile.value = [];
					showUploadDialog.value = false;
				}
			})
			.catch((err) => {
				console.error(err);
				eventBus.emit("show-snackbar", {
					message: $t("messages.errors.saveFileImportFailed"),
					timeout: -1,
					color: "error",
				});
				uploadedFile.value = [];
				showUploadDialog.value = false;
			});
	}
}

function deleteSave(): void {
	store.resetState();
	store.deleteSave();
}
</script>
