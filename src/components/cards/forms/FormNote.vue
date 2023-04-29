<template>
	<!-- Show title if "Add" form version -->
	<v-card-title v-if="props.variant === 'add'" class="justify-center">
		<v-icon :icon="categoryIcon" />
		<span class="mx-2">{{ $t("dialogs.addNote") }}</span>
	</v-card-title>
	<v-card-text>
		<v-container>
			<v-text-field v-model="model.title" :label="$t('fields.title')" />
			<v-textarea
				v-model="model.desc"
				:label="$t('fields.desc') + '*'"
				:hint="$t('fields.mdSupport')"
				:rules="[requiredRule]"
				variant="outlined"
				auto-grow
			/>
			<TagListPanel v-model="model.tags" :exclude-id="model.id" />
		</v-container>
		<small>{{ "*" + $t("fields.requiredField") }}</small>
	</v-card-text>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Note } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import utilities from "@/core/utilities";
import { required } from "@/core/validationRules";
import TagListPanel from "../tags/TagListPanel.vue";

const props = defineProps<{
	modelValue: Note; // v-model
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
