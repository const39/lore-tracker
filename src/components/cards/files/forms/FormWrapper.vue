<template>
	<v-form ref="form" v-model="isValid" validate-on="input">
		<v-card class="pa-2 border" variant="outlined">
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
			<!-- Show title if "Add" form variant -->
			<v-card-title v-if="variant === 'add' && model" class="justify-center">
				<v-icon :icon="getIcon(model)" />
				<span class="mx-2">
					{{ $t(`dialogs.add${utilities.capitalize(model._category)}`) }}
				</span>
			</v-card-title>
			<v-card-text>
				<component :is="formComponent" v-if="formComponent" v-model="model" />
				<small>{{ "*" + $t("fields.requiredField") }}</small>
			</v-card-text>
		</v-card>
	</v-form>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, defineAsyncComponent, ref, watch } from "vue";
import { VForm } from "vuetify/components";
import { getIcon } from "@/core/icons";
import { t as $t } from "@/core/translation";
import utilities from "@/core/utilities";
import { useCardsStore } from "@/store/cards";
import { useGlobalCardForm } from "@/store/globalCardForm";
import { useGlobalSnackbar } from "@/store/snackbar";

const emit = defineEmits<{
	(e: "change", value: boolean): void;
}>();

const cardsStore = useCardsStore();
const globalSnackbar = useGlobalSnackbar();
const formStore = useGlobalCardForm();
const { isOpen, variant, parentFolder, model } = storeToRefs(formStore);

const form = ref<VForm | undefined>();
const isValid = ref(false);

watch(isOpen, (value) => emit("change", value));

// Force trigger validation on any change in model properties because Vuetify does not do it by itself for some reason
watch(model, () => form.value?.validate(), { deep: true });

const formComponent = computed(() => {
	if (!model.value) return undefined;
	const componentName = "Form" + utilities.capitalize(model.value._category);
	return defineAsyncComponent({
		loader: () => import(`./${componentName}.vue`),
	});
});

function close() {
	formStore.resetForm();
}

async function submit() {
	if ((await form.value?.validate()) && model.value) {
		// Update or add card based on form type
		if (variant.value === "edit") cardsStore.updateCard(model.value, parentFolder.value);
		else if (variant.value === "add") cardsStore.addCard(model.value, parentFolder.value);

		// Provide feedback to user when card is saved
		const msg = parentFolder.value?.absolutePath.isRoot()
			? $t(`categories.${model.value?._category}`) + " " + $t("messages.success.newCardStored")
			: $t(`categories.${model.value?._category}`) +
				" " +
				$t("messages.success.newCardStoredInFolder") +
				" " +
				parentFolder.value?.absolutePath;
		globalSnackbar.showSnackbar(msg, "info", 7000);
	}

	close();
}
</script>
