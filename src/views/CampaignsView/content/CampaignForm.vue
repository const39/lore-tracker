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
						:label="$t('fields.name') + '*'"
						:rules="rules.name"
						maxlength="30"
						counter
					/>
				</v-card-text>
			</v-card>
		</v-form>
	</v-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { VForm } from "vuetify/components";
import { Campaign } from "@/core/models";
import { t as $t } from "@/core/translation";
import Icon from "@/core/utils/icons";

const props = defineProps<{
	modelValue: boolean; // v-model
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: boolean): void;
	(e: "close"): void;
	(e: "submit", value: Campaign): void;
}>();

const rules = {
	name: [
		(v: string) => !!v || $t("fields.requiredField"),
		(v: string) => v.length <= 30 || "30 max.",
	],
};

const model = ref(new Campaign());
const isValid = ref(false);
const form = ref<VForm>();

const showDialog = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});

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
