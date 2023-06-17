<template>
	<v-form ref="form" v-model="isValid" @submit.prevent="submit">
		<v-card>
			<v-card-actions class="float-right">
				<v-spacer />
				<v-btn
					:disabled="!isValid"
					icon="mdi-check"
					color="primary"
					density="comfortable"
					@click="submit"
				/>
				<v-btn icon="mdi-close" density="comfortable" @click="close" />
			</v-card-actions>
			<v-card-title v-if="!edit" class="mb-1">
				{{ $t("dialogs.addFolder") }}
			</v-card-title>
			<v-card-text class="d-flex text-body-2">
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
			</v-card-text>
		</v-card>
	</v-form>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { type VForm } from "vuetify/components";
import ColorPickerMenu from "@/components/common/ColorPickerMenu.vue";
import { useTryCatch } from "@/composables/tryCatch";
import colors from "@/core/colors";
import { Icon } from "@/core/icons";
import { CardFolder, CardFolderMetadata } from "@/core/model/cards";
import { Path } from "@/core/model/fileTree";
import { t as $t } from "@/core/translation";
import utilities from "@/core/utilities";
import validationRules from "@/core/validationRules";
import { useCardsStore } from "@/store/cards";

const props = defineProps<{ edit?: CardFolder }>();
const emit = defineEmits<{
	(e: "close"): void;
	(e: "submit"): void;
}>();

const rules = {
	name: [
		validationRules.required($t("fields.requiredField")),
		validationRules.counter(100 + $t("fields.maxCharacterCount"), 100),
		validationRules.folderName($t("fields.illegalCharacters")),
		// Check name is not already used by another folder in the current parent folder
		(name: string) => {
			// If name is the current folder name, accept value
			const isCurrentName = name === props.edit?.metadata.name;
			// If name is already used by another folder, reject value
			const isUsedByOther = parent.value.hasFolder(new Path(name));
			return isCurrentName || !isUsedByOther || $t("fields.nameAlreadyUsed");
		},
	],
};

const baseColors = Object.values(colors).map((color) => color.base ?? "#ffffff");

const cardsStore = useCardsStore();

const model = ref(initModel());
const isValid = ref(false);
const form = ref<VForm | undefined>(undefined);

const parent = computed(() => cardsStore.currentFolder);

function getRandomColor(): string {
	const idx = Math.floor(Math.random() * baseColors.length);
	return baseColors[idx];
}

function initModel(): CardFolderMetadata {
	// We return a clone of the object to avoid modifying directly the store
	// Helpful when the user cancels their changes because we don't have to rollback
	if (typeof props.edit !== "undefined") return utilities.deepCopy(props.edit.metadata);
	return {
		id: utilities.uid(),
		_category: cardsStore.currentCategory,
		name: "",
		color: getRandomColor(),
	};
}

function close(): void {
	model.value = initModel();
	emit("close");
}

async function submit() {
	await form.value?.validate();
	if (isValid.value) {
		model.value.name = model.value.name.trim();
		useTryCatch(() => {
			if (props.edit) cardsStore.updateFolderMetadata(props.edit, model.value);
			else cardsStore.addFolder(new CardFolder(model.value));
			emit("submit");
		});
	}
}

// Because Vuetify's v-color-picker does not support validation, it does not trigger form validation when updated
// so we have to trigger it manually 
watch(
	() => model.value.color,
	() => form.value?.validate()
);
</script>
