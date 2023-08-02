<template>
	<v-row class="my-3 d-flex align-center">
		<div>
			<v-hover v-slot="{ isHovering, props: hoverProps }">
				<div class="text-xl-h4 mb-2" v-bind="hoverProps">
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

		<v-divider class="ml-3 mr-1" vertical />

		<div>
			<slot name="actions" />
		</div>
	</v-row>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { VForm } from "vuetify/components";
import { Campaign } from "@/core/models";
import { t as $t } from "@/core/translation";
import { deepCopy } from "@/core/utils/functions";
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
		validationRules.required($t("fields.requiredField")),
		validationRules.counter("50 max.", 50),
	],
};

const editName = ref(false);
const isNameValid = ref(false);
const model = ref<Campaign>(deepCopy(props.modelValue)); // Clone object to keep a backup in case the user cancels their changes
const form = ref<VForm>();

function toggleNameField() {
	editName.value = !editName.value;
}

function updateName() {
	update();
	// If the name change is successful, toggle the field back to readonly
	if (isNameValid.value !== false) toggleNameField();
}

function update() {
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
