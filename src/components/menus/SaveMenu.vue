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
			<v-list-item prepend-icon="" @click="confirmDeletion">
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
</template>

<script lang="ts" setup>
import { ref } from "vue";
import eventBus from "@/core/eventBus";
import { deleteSave, exportSaveToFile, importSave } from "@/core/save/save-manager";
import { t as $t } from "@/core/translation";
import { useGlobalConfirmDialog } from "@/store/confirmDialog";
import { useGlobalSnackbar } from "@/store/snackbar";
import MenuActivator from "./MenuActivator.vue";

const uploadedFile = ref<File[]>([]); // v-file-input only accepts an array of files
const showUploadDialog = ref(false);

const { showSnackbar } = useGlobalSnackbar();
const { showConfirmDialog } = useGlobalConfirmDialog();

async function downloadSave() {
	const file = await exportSaveToFile();
	const a = document.createElement("a");
	a.href = URL.createObjectURL(file);
	a.download = `LoreTracker_backup_${new Date().toLocaleDateString()}.json`;
	a.click();
}

function uploadSave() {
	// v-file-input only accepts an array of files, but we do not use the 'multiple' prop
	// so we only use the first element in the array
	if (uploadedFile.value.length) {
		uploadedFile.value[0]
			.text()
			.then(async (value: string) => {
				try {
					await importSave(value);
					eventBus.emit("data-loaded");
					showSnackbar({
						message: $t("messages.success.saveFileImportSuccessful"),
						timeout: 7000,
						color: "success",
					});
				} catch (err) {
					console.error(err);
					const message = `${$t("messages.errors.corruptedSave")} ${$t(
						"messages.errors.saveFileImportCancelled"
					)}`;
					showSnackbar({
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
				showSnackbar({
					message: $t("messages.errors.saveFileImportFailed"),
					timeout: -1,
					color: "error",
				});
				uploadedFile.value = [];
				showUploadDialog.value = false;
			});
	}
}

function confirmDeletion() {
	showConfirmDialog({
		title: $t("options.save.deleteDialogTitle"),
		message: $t("options.save.deleteDialogMessage"),
		confirmAction: deleteSave,
	});
}
</script>
