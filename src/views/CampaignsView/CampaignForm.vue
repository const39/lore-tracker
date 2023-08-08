<template>
	<v-dialog v-model="showDialog" max-width="375">
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
				<v-card-title class="mb-1">
					<v-icon :icon="Icon.campaign" size="small" start />
					{{ $t("dialogs.addCampaign") }}
				</v-card-title>
				<v-card-text class="d-flex text-body-2">
					<v-text-field
						v-model="model.name"
						:label="$t('pages.loreBook.fields.labels.name') + '*'"
						:rules="rules.name"
						maxlength="50"
						counter
					/>
				</v-card-text>
			</v-card>
		</v-form>
	</v-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { VForm } from "vuetify/components";
import { Campaign } from "@/core/models";
import { t as $t } from "@/core/translation";
import Icon from "@/core/utils/icons";
import validationRules from "@/core/validationRules";

const emit = defineEmits<{
	(e: "close"): void;
	(e: "submit", value: Campaign): void;
}>();

const showDialog = defineModel<boolean>({ required: true }); // v-model

const rules = {
	name: [
		validationRules.required($t("pages.loreBook.fields.errors.requiredField")),
		validationRules.counter("50 max.", 50),
	],
};

const model = ref(new Campaign());
const isValid = ref(false);
const form = ref<VForm>();

function close() {
	showDialog.value = false;
	resetModel();
	emit("close");
}

async function submit() {
	await form.value?.validate();
	if (isValid.value) {
		emit("submit", model.value as Campaign); // Note: type cast is necessary because of https://github.com/vuejs/core/issues/2981
		showDialog.value = false;
		resetModel();
	}
}

function resetModel() {
	model.value = new Campaign();
}
</script>
