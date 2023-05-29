<template>
	<v-form ref="form" v-model="isValid" validate-on="input">
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
		<v-card-title v-if="model" class="mb-1 justify-center">
			<v-icon :icon="getIcon(model)" />
			<span class="mx-2">
				{{ $t(`dialogs.${variant}${utilities.capitalize(model._category)}`) }}
			</span>
		</v-card-title>
		<v-card-text>
			<component :is="formComponent" v-if="formComponent" v-model="model" />
			<small>{{ "*" + $t("fields.requiredField") }}</small>
		</v-card-text>
	</v-form>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref, watch } from "vue";
import { VForm } from "vuetify/components";
import { useTryCatch } from "@/composables/tryCatch";
import { getIcon } from "@/core/icons";
import { t as $t } from "@/core/translation";
import utilities from "@/core/utilities";
import { useCardsStore } from "@/store/cards";
import { useSidePanel } from "@/store/sidePanel";
import { useGlobalSnackbar } from "@/store/snackbar";

const cardsStore = useCardsStore();
const globalSnackbar = useGlobalSnackbar();
const sidePanelStore = useSidePanel();
const { variant, parentFolder, model } = sidePanelStore.formState;

const form = ref<VForm | undefined>();
const isValid = ref(false);

// Force trigger validation on any change in model properties because Vuetify does not do it by itself for some reason
watch(
	() => model,
	() => form.value?.validate(),
	{ deep: true }
);

const formComponent = computed(() => {
	if (!model) return undefined;
	const componentName = "Form" + utilities.capitalize(model._category);
	return defineAsyncComponent({
		loader: () => import(`./${componentName}.vue`),
	});
});

function close() {
	sidePanelStore.resetForm();
}

async function submit() {
	if ((await form.value?.validate()) && model) {
		useTryCatch(() => {
			// Update or add card based on form type
			if (variant === "edit") cardsStore.updateCard(model, parentFolder);
			else if (variant === "add") cardsStore.addCard(model, parentFolder);
	
			// Provide feedback to user when card is saved
			const msg = parentFolder?.absolutePath.isRoot()
				? $t(`categories.${model?._category}`) + " " + $t("messages.success.newCardStored")
				: $t(`categories.${model?._category}`) +
					" " +
					$t("messages.success.newCardStoredInFolder") +
					" " +
					parentFolder?.absolutePath;
			globalSnackbar.showSnackbar(msg, "info", 7000);
		})
	}

	close();
}
</script>
