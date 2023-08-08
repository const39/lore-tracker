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
		<v-card-title class="mb-1">
			{{ $t(`dialogs.${variant}Folder`) }}
		</v-card-title>
		<v-card-text>
			<div class="d-flex text-body-2">
				<ColorPickerMenu v-model="model.color" :modes="['rgb', 'hsl', 'hex']" mode="rgb">
					<template #activator="{ color }">
						<v-icon :icon="Icon.folder" :color="color" size="x-large" />
					</template>
				</ColorPickerMenu>
				<v-text-field
					v-model="model.name"
					:label="$t('pages.loreBook.fields.labels.name') + '*'"
					:rules="rules.name"
				/>
			</div>
			<TagListPanel v-model="model.tags" :exclude-id="model.id" />
		</v-card-text>
	</v-form>
</template>

<script lang="ts" setup>
import { useRepo } from "pinia-orm";
import { ref, watch } from "vue";
import { type VForm } from "vuetify/components";
import TagListPanel from "@/components/cards/tags/TagListPanel.vue";
import ColorPickerMenu from "@/components/common/ColorPickerMenu.vue";
import { useTryCatch } from "@/composables/tryCatch";
import { Folder } from "@/core/models";
import { FolderRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import utilities from "@/core/utils/functions";
import { Icon } from "@/core/utils/icons";
import validationRules from "@/core/validationRules";

const props = defineProps<{
	variant: "add" | "edit";
	baseModel: Folder;
}>();

const emit = defineEmits(["close", "submit"]);

const folderRepo = useRepo(FolderRepo);

const rules = {
	name: [
		validationRules.required($t("pages.loreBook.fields.errors.requiredField")),
		validationRules.counter(
			$t("pages.loreBook.fields.errors.maxCharacterCount", { n: 100 }),
			100
		),
		validationRules.folderName($t("pages.loreBook.fields.errors.illegalCharacters")),
		// Check name is not already used by another folder in the current parent folder
		(name: string) => {
			// If name is the current folder name, accept value
			const isCurrentName = name === props.baseModel.name;
			// If name is already used by another folder, reject value
			const siblings = folderRepo.getSiblings(props.baseModel);
			const isUsedByOther = !!siblings.find(
				(x) => x.name.trim().toLowerCase() === name.trim().toLowerCase()
			);
			return (
				isCurrentName ||
				!isUsedByOther ||
				$t("pages.loreBook.fields.errors.nameAlreadyUsed")
			);
		},
	],
};

const model = ref<Folder>(utilities.deepCopy(props.baseModel)); // Clone object to keep a backup in case the user cancels their changes
const isValid = ref(false);
const form = ref<VForm | undefined>(undefined);

// Clone object to keep a backup in case the user cancels their changes
watch(
	() => props.baseModel,
	() => (model.value = utilities.deepCopy(props.baseModel)),
	{ deep: true }
);

// Force trigger validation on any change in model properties because Vuetify does not do it by itself for some reason
watch(model, () => form.value?.validate(), { deep: true });

async function submit() {
	await form.value?.validate();
	if (isValid.value) {
		model.value.name = model.value.name.trim();
		useTryCatch(() => {
			// Add or update the folder
			// Note: type casts are necessary because of https://github.com/vuejs/core/issues/2981
			if (props.variant === "add") folderRepo.add(model.value as Folder);
			else folderRepo.update(model.value as Folder);
			emit("submit");
		});
	}
}
</script>
