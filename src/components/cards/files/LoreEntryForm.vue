<template>
	<v-form ref="form" v-model="isValid" validate-on="input" @submit.prevent="submit">
		<v-card-actions class="float-right">
			<v-spacer />
			<v-btn
				:disabled="!isValid"
				icon="mdi-check"
				color="primary"
				density="comfortable"
				@click="submit"
			/>
			<v-btn icon="mdi-close" density="comfortable" @click="$emit('close')" />
		</v-card-actions>
		<v-card-title v-if="model" class="mb-4 justify-center">
			<v-icon :icon="model.getIcon()" />
			<span class="mx-2">
				{{ $t(`dialogs.${variant}${utilities.capitalize(model.category)}`) }}
			</span>
		</v-card-title>
		<v-card-text>
			<component :is="formComponent" v-if="formComponent" v-model="model" />
			<small>{{ "*" + $t("pages.loreBook.fields.errors.requiredField") }}</small>
		</v-card-text>
	</v-form>
</template>

<script lang="ts" setup>
import { useRepo } from "pinia-orm";
import { computed, defineAsyncComponent, ref } from "vue";
import { VForm } from "vuetify/components";
import { useFormModel } from "@/composables/formModel";
import { useTryCatch } from "@/composables/tryCatch";
import { LoreEntry } from "@/core/models";
import { FolderRepo, LoreEntryRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import utilities from "@/core/utils/functions";
import { useGlobalSnackbar } from "@/store/snackbar";

const props = defineProps<{
	variant: "add" | "edit";
	baseModel: LoreEntry;
}>();

const emit = defineEmits(["close", "submit"]);

const repo = useRepo(LoreEntryRepo);
const globalSnackbar = useGlobalSnackbar();

const form = ref<VForm | undefined>();
const isValid = ref(false);
const model = useFormModel<LoreEntry>(() => props.baseModel, form, { validate: true }); // Get model from the initialValue to avoid modifying the prop itself

const formComponent = computed(() => {
	return defineAsyncComponent({
		loader: () => import(`./forms/Form${utilities.capitalize(model.value.category)}.vue`),
	});
});

async function submit() {
	await form.value?.validate();
	if (isValid.value && model.value) {
		useTryCatch(() => {
			// Add or update the Lore entry
			// Note: type casts are necessary because of https://github.com/vuejs/core/issues/2981
			if (props.variant === "add") repo.add(model.value as LoreEntry);
			else repo.update(model.value as LoreEntry);

			// Display feedback snackbar when card is saved
			if (model.value.folderId) {
				const parentFolder = useRepo(FolderRepo).getFolder(model.value.folderId);
				const message = parentFolder?.isRoot()
					? $t(`data.categories.${model.value?.category}`) +
						" " +
						$t("messages.success.newCardStored")
					: $t(`data.categories.${model.value?.category}`) +
						" " +
						$t("messages.success.newCardStoredInFolder") +
						" " +
						parentFolder?.name;
				globalSnackbar.showSnackbar({ message, color: "info", timeout: 7000 });
			}
		});
		emit("submit");
	}
}
</script>
