<template>
	<v-form ref="form">
		<v-card>
			<v-card-title class="text-h5"> Ajouter un dossier </v-card-title>
			<v-card-text class="d-flex align-center text-body-2">
				<v-menu>
					<template v-slot:activator="{ props }">
						<v-hover>
							<template #default="{ isHovering }">
								<v-btn v-bind="props" class="mr-1" icon size="x-large">
									<v-icon size="x-large" :color="model.color"> {{ folderIcon }} </v-icon>
									<v-fade-transition>
										<v-overlay v-if="isHovering" absolute opacity="0.2">
											<v-icon size="small">mdi-eyedropper-variant</v-icon>
										</v-overlay>
									</v-fade-transition>
								</v-btn>
							</template>
						</v-hover>
					</template>
					<v-color-picker v-model="model.color" :rules="rules.color"></v-color-picker>
				</v-menu>
				<v-text-field :label="$t('fields.name') + '*'" :rules="rules.name" v-model="model.name"></v-text-field>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn variant="text" @click="close"> {{ $t("actions.close") }} </v-btn>
				<v-btn variant="text" color="primary" @click="submit"> {{ $t("actions.save") }} </v-btn>
			</v-card-actions>
		</v-card>
	</v-form>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { Folder, Icon } from "@/js/types";
import utilities from "@/js/utilities";
import validationRules from "@/js/validationRules";

import colors from "@/js/colors";
import { type VForm } from "vuetify/components";

import { ref, computed } from "vue";
import { useNotepadStore } from "@/store/notepad";

const props = defineProps<{ parentPath: string; edit?: Folder }>();
const emit = defineEmits<{
	(e: "close"): void;
	(e: "submit"): void;
}>();

const rules = {
	color: [validationRules.required($t("fields.requiredField")), validationRules.hex("")],
	name: [
		validationRules.required($t("fields.requiredField")),
		validationRules.counter("", 25),
		(this as any).checkNameDoesNotExist,
	],
};

const model = ref(initModel());
const form = ref<VForm | undefined>(undefined);

const notepadStore = useNotepadStore();

const folderIcon = computed(() => Icon.folder);

function getRandomColor(): string {
	// ! baseColors cannot be cached as a computed property because initModel() is called at component init
	const baseColors = Object.values(colors).map((color) => color.base ?? "#ffffff");
	const idx = Math.floor(Math.random() * baseColors.length);
	return baseColors[idx];
}

function checkNameDoesNotExist(name: string): boolean | string {
	return !notepadStore.doesFolderExist(name) || $t("fields.nameAlreadyUsed");
}

function initModel(): Folder {
	// We return a clone of the object to avoid modifying directly the store
	// Helpful when the user cancels their changes because we don't have to rollback
	if (typeof props.edit !== "undefined") return utilities.deepCopy(props.edit) as Folder;
	return {
		id: utilities.uid(),
		name: "",
		color: getRandomColor(),
	};
}

function close(): void {
	model.value = initModel();
	emit("close");
}

async function submit() {
	if (await form.value?.validate()) {
		if (props.edit) {
			// TODO
			console.warn("updateFolder() not implemented yet");
		} else notepadStore.addFolder({ pathToParent: props.parentPath, folder: model.value });
		emit("submit");
	}
}
</script>

<style></style>
