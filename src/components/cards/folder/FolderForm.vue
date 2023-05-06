<template>
	<v-form ref="form" v-model="isValid">
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
			<v-card-title v-if="!edit">
				{{ $t("dialogs.addFolder") }}
			</v-card-title>
			<v-card-text class="d-flex text-body-2">
				<v-menu location="left">
					<template #activator="{ props: menuProps }">
						<v-hover>
							<template #default="{ isHovering, props: hoverProps }">
								<div v-bind="mergeProps(menuProps, hoverProps)">
									<v-btn class="mr-1" size="x-large" variant="text" icon>
										<v-icon
											:icon="Icon.folder"
											:color="model.color"
											size="x-large"
										/>
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
		</v-card>
	</v-form>
</template>

<script lang="ts" setup>
import { computed, mergeProps, ref } from "vue";
import { type VForm } from "vuetify/components";
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
	color: [validationRules.required($t("fields.requiredField")), validationRules.hex("")],
	name: [
		validationRules.required($t("fields.requiredField")),
		validationRules.counter("", 25),
		// Check name is not already used by another folder in the current parent folder
		(name: string) => !parent.value.hasFolder(new Path(name)) || $t("fields.nameAlreadyUsed"),
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
	if (await form.value?.validate()) {
		if (props.edit) cardsStore.updateFolderMetadata(props.edit, model.value);
		else cardsStore.addFolder(new CardFolder(model.value));
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
