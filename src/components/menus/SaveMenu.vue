<template>
	<MenuActivator :close-on-content-click="false" :title="$t('options.save.optionName')" icon="mdi-content-save">
		<v-list density="compact">
			<v-list-item prepend-icon="mdi-download" @click="downloadSave">
				<v-list-item-title>{{ $t("options.save.downloadText") }}</v-list-item-title>
			</v-list-item>
			<v-list-item prepend-icon="mdi-upload" @click="showUploadDialog = true">
				<v-list-item-title>{{ $t("options.save.uploadText") }}</v-list-item-title>
			</v-list-item>
			<v-list-item prepend-icon="" @click="showConfirmDialog = true">
				<template #prepend>
					<v-icon color="red">mdi-delete</v-icon>
				</template>
				<v-list-item-title class="text-red">
					{{ $t("options.save.deleteText") }}
				</v-list-item-title>
			</v-list-item>
		</v-list>
	</MenuActivator>

	<!-- Save file upload dialog -->
	<v-dialog v-model="showUploadDialog" persistent max-width="450">
		<v-card>
			<v-card-title class="text-h5">{{ $t("options.save.uploadText") }}</v-card-title>
			<v-card-text>
				<v-file-input
					v-model="uploadedFile"
					variant="outlined"
					accept="application/json"
					:label="$t('options.save.uploadInputLabel')"
					:messages="$t('options.save.uploadInputHint')"
				></v-file-input>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn variant="text" @click="showUploadDialog = false">
					{{ $t("actions.close") }}
				</v-btn>
				<v-btn variant="text" color="primary" @click="uploadSave">{{ $t("actions.save") }}</v-btn>
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
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { ref } from "vue";

import ConfirmDialog from "@/components/ConfirmDialog.vue";
import MenuActivator from "./MenuActivator.vue";
import { useEventHub, SnackbarEvent } from "@/js/eventHub";
import { useStore } from "@/store";

const uploadedFile = ref<File[]>([]); // v-file-input only accepts an array of files
const showUploadDialog = ref(false);
const showConfirmDialog = ref(false);

const eventHub = useEventHub();
const store = useStore();

function downloadSave(): void {
	const a = document.createElement("a");
	const blob = new Blob([store.toJSON], { type: "application/json" });
	a.href = URL.createObjectURL(blob);
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
					eventHub.emit(
						SnackbarEvent.ID,
						new SnackbarEvent($t("messages.success.saveFileImportSuccessful"), -1, "success")
					);
				} catch (err) {
					console.error(err);
					const msg = `${$t("messages.errors.corruptedSave")} ${$t(
						"messages.errors.saveFileImportCancelled"
					)}`;
					eventHub.emit(SnackbarEvent.ID, new SnackbarEvent(msg, -1, "error"));
				} finally {
					uploadedFile.value = [];
					showUploadDialog.value = false;
				}
			})
			.catch((err: any) => {
				console.error(err);
				eventHub.emit(
					SnackbarEvent.ID,
					new SnackbarEvent($t("messages.errors.saveFileImportFailed"), -1, "error")
				);
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

<style></style>
