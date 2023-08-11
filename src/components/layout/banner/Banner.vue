<template>
	<div class="py-4 d-flex align-center">
		<div>
			<v-btn
				:to="{ name: 'Campaigns' }"
				:text="$t('pages.loreBook.banner.backToCampaigns')"
				class="px-2"
				prepend-icon="mdi-arrow-left"
				variant="flat"
			/>
			<v-hover v-slot="{ isHovering, props: hoverProps }">
				<div class="text-xl-h4 my-2" v-bind="hoverProps">
					<v-form
						v-if="editName"
						ref="form"
						v-model="isNameValid"
						validate-on="input"
						@submit.prevent="updateName"
					>
						<v-text-field
							v-model="model.name"
							:rules="rules.name"
							class="campaign-name-field min-width"
							maxlength="50"
							append-inner-icon="mdi-check"
							autofocus
							counter
							@click:append-inner="updateName"
						/>
					</v-form>
					<span v-else>
						{{ model.name }}
						<v-icon
							v-show="isHovering"
							size="x-small"
							icon="mdi-pencil"
							@click="toggleNameField"
						/>
					</span>
				</div>
			</v-hover>

			<StatusTray v-model:day="model.days" v-model:season="model.season" />
		</div>
		<v-spacer />
		<div class="text-right search-bar min-width">
			<SearchBar />
		</div>

		<v-divider class="ml-6 mr-2" vertical />

		<div>
			<slot name="actions" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { VForm } from "vuetify/components";
import { useFormModel } from "@/composables/formModel";
import { Campaign } from "@/core/models";
import { t as $t } from "@/core/translation";
import validationRules from "@/core/validationRules";
import SearchBar from "./actions/SearchBar.vue";
import StatusTray from "./StatusTray.vue";

const props = defineProps<{
	modelValue: Campaign; // v-model
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: Campaign): void;
}>();

const rules = {
	name: [
		validationRules.required($t("pages.loreBook.fields.errors.requiredField")),
		validationRules.counter("50 max.", 50),
	],
};

const editName = ref(false);
const isNameValid = ref(false);
const form = ref<VForm>();
const model = useFormModel<Campaign>(() => props.modelValue, form, { validate: true }); // Get model from the initialValue to avoid modifying the prop itself

function toggleNameField() {
	editName.value = !editName.value;
}

async function updateName() {
	await update();
	// If the name change is successful, toggle the field back to readonly
	if (isNameValid.value !== false) toggleNameField();
}

async function update() {
	await form.value?.validate();
	// Update is successful when
	// - there's no form (i.e. the name field is still readonly)
	// - the new name is valid (isNameValid === true) or has not been changed (isNameValid === null)
	if (!form.value || isNameValid.value !== false) {
		emit("update:modelValue", model.value as Campaign); // Note: type cast is necessary because of https://github.com/vuejs/core/issues/2981
	}
}

watch([() => model.value.days, () => model.value.season], update);
</script>

<style scoped>
.campaign-name-field.min-width {
	min-width: 300px;
}

.search-bar.min-width {
	min-width: 300px;
}
</style>
