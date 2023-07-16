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
import { getIcon } from "@/core/utils/icons";
import { CardFolder, CardTypes } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import utilities from "@/core/utils/functions";
import { useCardsStore } from "@/store/cards";
import { useGlobalSnackbar } from "@/store/snackbar";

const props = defineProps<{
	variant: "add" | "edit";
	parentFolder: CardFolder;
	baseModel: CardTypes;
}>();

const emit = defineEmits(["close", "submit"]);

const cardsStore = useCardsStore();
const globalSnackbar = useGlobalSnackbar();

const form = ref<VForm | undefined>();
const model = ref<CardTypes>(utilities.deepCopy(props.baseModel)); // Clone object to keep a backup in case the user cancels their changes
const isValid = ref(false);

// Clone object to keep a backup in case the user cancels their changes
watch(
	() => props.baseModel,
	() => (model.value = utilities.deepCopy(props.baseModel)),
	{ deep: true }
);

// Force trigger validation on any change in model properties because Vuetify does not do it by itself for some reason
watch(model, () => form.value?.validate(), { deep: true });

const formComponent = computed(() => {
	return defineAsyncComponent({
		loader: () => import(`./Form${utilities.capitalize(model.value._category)}.vue`),
	});
});

async function submit() {
	await form.value?.validate();
	if (isValid.value && model.value) {
		useTryCatch(() => {
			// Update or add card based on form type
			if (props.variant === "edit") cardsStore.updateCard(model.value, props.parentFolder);
			else if (props.variant === "add") cardsStore.addCard(model.value, props.parentFolder);

			// Provide feedback to user when card is saved
			const msg = props.parentFolder?.absolutePath.isRoot()
				? $t(`categories.${model.value?._category}`) +
					" " +
					$t("messages.success.newCardStored")
				: $t(`categories.${model.value?._category}`) +
					" " +
					$t("messages.success.newCardStoredInFolder") +
					" " +
					props.parentFolder?.absolutePath;
			globalSnackbar.showSnackbar(msg, "info", 7000);
		});
		emit("submit");
	}
}
</script>
