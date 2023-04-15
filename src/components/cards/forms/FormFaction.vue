<template>
	<!-- Show title if "Add" form version -->
	<v-card-title v-if="props.variant === 'add'" class="justify-center">
		<v-icon>{{ categoryIcon }}</v-icon>
		<span class="mx-2">{{ $t("dialogs.addFaction") }}</span>
	</v-card-title>
	<v-card-text>
		<v-container>
			<v-text-field v-model="model.name" :label="$t('fields.name') + '*'" :rules="[requiredRule]"></v-text-field>
			<v-textarea
				v-model="model.desc"
				:label="$t('fields.desc')"
				:hint="$t('fields.mdSupport')"
				variant="outlined"
				auto-grow
			></v-textarea>
			<TagListPanel v-model="model.tags" :exclude-id="model.id" />
		</v-container>
		<small>{{ "*" + $t("fields.requiredField") }}</small>
	</v-card-text>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { Faction } from "@/js/types";
import utilities from "@/js/utilities";
import { required } from "@/js/validationRules";
import { computed } from "vue";
import TagListPanel from "../tags/TagListPanel.vue";

const props = defineProps<{
	modelValue: Faction; // v-model
	variant: "edit" | "add";
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: typeof props.modelValue): void;
}>();

const model = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});

const categoryIcon = utilities.getIcon(model.value);

const requiredRule = required($t("fields.requiredField"));
</script>
