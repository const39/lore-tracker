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
					:label="$t('fields.name') + '*'"
					:rules="rules.name"
				/>
			</div>
			<TagListPanel v-model="model.tags" :exclude-id="model.id" />
		</v-card-text>
	</v-form>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { type VForm } from "vuetify/components";
import TagListPanel from "@/components/cards/tags/TagListPanel.vue";
import ColorPickerMenu from "@/components/common/ColorPickerMenu.vue";
import { useTryCatch } from "@/composables/tryCatch";
import { Icon } from "@/core/utils/icons";
import { CardFolder, CardFolderMetadata } from "@/core/model/cards";
import { Path } from "@/core/model/fileTree";
import { t as $t } from "@/core/translation";
import utilities from "@/core/utils/functions";
import validationRules from "@/core/validationRules";
import { useCardsStore } from "@/store/cards";

const props = defineProps<{
	variant: "add" | "edit";
	parentFolder: CardFolder;
	folderToEdit: CardFolder;
}>();

const emit = defineEmits(["close", "submit"]);

const rules = {
	name: [
		validationRules.required($t("fields.requiredField")),
		validationRules.counter(100 + $t("fields.maxCharacterCount"), 100),
		validationRules.folderName($t("fields.illegalCharacters")),
		// Check name is not already used by another folder in the current parent folder
		(name: string) => {
			// If name is the current folder name, accept value
			const isCurrentName = name === props.folderToEdit.metadata.name;
			// If name is already used by another folder, reject value
			const isUsedByOther = props.parentFolder.hasFolder(new Path(name));
			return isCurrentName || !isUsedByOther || $t("fields.nameAlreadyUsed");
		},
	],
};

const cardsStore = useCardsStore();

const model = ref<CardFolderMetadata>(utilities.deepCopy(props.folderToEdit.metadata)); // Clone object to keep a backup in case the user cancels their changes
const isValid = ref(false);
const form = ref<VForm | undefined>(undefined);

// Clone object to keep a backup in case the user cancels their changes
watch(
	() => props.folderToEdit.metadata,
	() => (model.value = utilities.deepCopy(props.folderToEdit.metadata)),
	{ deep: true }
);

// Force trigger validation on any change in model properties because Vuetify does not do it by itself for some reason
watch(model, () => form.value?.validate(), { deep: true });

async function submit() {
	await form.value?.validate();
	if (isValid.value) {
		model.value.name = model.value.name.trim();
		useTryCatch(() => {
			if (props.variant === "edit")
				cardsStore.updateFolderMetadata(props.folderToEdit, model.value);
			else cardsStore.addFolder(new CardFolder(model.value));
			emit("submit");
		});
	}
}
</script>
