<template>
	<v-form v-model="isValid" ref="form">
		<!-- Show title if "Add" form version -->
		<v-card-title v-if="props.edit === undefined" class="justify-center">
			<v-icon>{{ categoryIcon }}</v-icon>
			<span class="mx-2">{{ $t("dialogs.addFaction") }}</span>
		</v-card-title>
		<v-card-text>
			<v-container>
				<v-text-field
					:label="$t('fields.name') + '*'"
					:rules="[requiredRule]"
					v-model="model.name"
				></v-text-field>
				<v-textarea
					variant="outlined"
					auto-grow
					:label="$t('fields.desc')"
					:hint="$t('fields.mdSupport')"
					v-model="model.desc"
				></v-textarea>
				<TagListPanel v-model="model.tags" :exclude-id="model.id" />
			</v-container>
			<small>{{ "*" + $t("fields.requiredField") }}</small>
		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn variant="text" @click="close">{{ $t("actions.close") }}</v-btn>
			<v-btn color="primary" variant="text" :disabled="!isValid" @click="onSubmit">
				{{ $t("actions.save") }}
			</v-btn>
		</v-card-actions>
	</v-form>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { CardCategory, Faction, ID } from "@/js/types";
import utilities from "@/js/utilities";
import { required } from "@/js/validationRules";
import { useForm } from "@/composables/form";
import { ref } from "vue";
import type { VForm } from "vuetify/components";
import TagListPanel from "../tags/TagListPanel.vue";

const props = defineProps<{
	edit?: ID; // [Optional] leave undefined to use the "Add" form instead of "Edit" form
}>();

const emit = defineEmits<{
	(e: "close"): void;
}>();

const requiredRule = required($t("fields.requiredField"));
const form = ref<VForm | undefined>(undefined);

function factory(): Faction {
	return {
		_category: CardCategory.Faction,
		id: utilities.uid(),
		desc: "",
		tags: [],
		name: "",
	};
}

const { model, isValid, submit, reset } = useForm<Faction>(form, CardCategory.Faction, factory, {
	edit: props.edit,
});

const categoryIcon = utilities.getIcon(model.value);

function onSubmit() {
	// Use callback instead of promise because the parent container will not catch the 'close' event for some reason
	submit(() => close())
}

function close() {
	reset();
	// Fire a custom event to the parent component. The parent can decide to catch this event to react to the user action.
	emit("close");
}
</script>
