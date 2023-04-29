<template>
	<v-form ref="form">
		<v-card>
			<v-card-title class="text-h5"> Ajouter un dossier </v-card-title>
			<v-card-text class="d-flex text-body-2">
				<v-menu location="left">
					<template #activator="{ props: menuProps }">
						<v-hover>
							<template #default="{ isHovering, props: hoverProps }">
								<div v-bind="mergeProps(menuProps, hoverProps)">
									<v-btn class="mr-1" size="x-large" variant="text" icon>
										<v-icon
											:icon="folderIcon"
											:color="model.color"
											size="x-large"
										></v-icon>
										<v-fade-transition>
											<v-icon
												v-if="isHovering"
												class="picker-btn-overlay"
												size="x-small"
												icon="mdi-eyedropper-variant"
												color="white"
											/>
										</v-fade-transition>
									</v-btn>
								</div>
							</template>
						</v-hover>
					</template>
					<v-color-picker v-model="model.color" :rules="rules.color" />
				</v-menu>
				<v-text-field
					v-model="model.name"
					:label="$t('fields.name') + '*'"
					:rules="rules.name"
				/>
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn variant="text" @click="close">
					{{ $t("actions.close") }}
				</v-btn>
				<v-btn variant="text" color="primary" @click="submit">
					{{ $t("actions.save") }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-form>
</template>

<script lang="ts" setup>
import colors from "@/js/colors";
import { Folder, FolderMetadata, Path } from "@/js/model/fileTree";
import { t as $t } from "@/js/translation";
import { Icon } from "@/js/types";
import utilities from "@/js/utilities";
import validationRules from "@/js/validationRules";
import { useNotepadStore } from "@/store/notepad";
import { computed, mergeProps, ref } from "vue";
import { type VForm } from "vuetify/components";

const props = defineProps<{ parent: Folder; edit?: Folder }>();
const emit = defineEmits<{
	(e: "close"): void;
	(e: "submit"): void;
}>();

const rules = {
	color: [validationRules.required($t("fields.requiredField")), validationRules.hex("")],
	name: [
		validationRules.required($t("fields.requiredField")),
		validationRules.counter("", 25),
		checkNameDoesNotExist,
	],
};

const baseColors = Object.values(colors).map((color) => color.base ?? "#ffffff");

const model = ref(initModel());
const form = ref<VForm | undefined>(undefined);

const notepadStore = useNotepadStore();

const folderIcon = computed(() => Icon.folder);

function getRandomColor(): string {
	const idx = Math.floor(Math.random() * baseColors.length);
	return baseColors[idx];
}

function checkNameDoesNotExist(name: string): boolean | string {
	const path = new Path(props.parent.path, name);
	return !notepadStore.hasFolder(path) || $t("fields.nameAlreadyUsed");
}

function initModel(): FolderMetadata {
	// We return a clone of the object to avoid modifying directly the store
	// Helpful when the user cancels their changes because we don't have to rollback
	if (typeof props.edit !== "undefined") return utilities.deepCopy(props.edit.metadata);
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
			// notepadStore.updateFolder({
			// 	pathToParent: utilities.joinPaths(true, props.parentPath, model.value.name),
			// 	folder: model.value,
			// });
		} else notepadStore.addFolder(new Folder(model.value, props.parent), props.parent.path);
		emit("submit");
	}
}
</script>
<style scoped>
.picker-btn-overlay {
	position: absolute;
	opacity: 0.75;
}
</style>
