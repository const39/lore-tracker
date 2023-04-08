<template>
	<v-form v-model="isValid" ref="form">
		<!-- Show title if "Add" form version -->
		<v-card-title v-if="props.edit === undefined" class="justify-center">
			<v-icon>{{ categoryIcon }}</v-icon>
			<span class="mx-2">{{ $t("dialogs.addCharacter") }}</span>
		</v-card-title>
		<v-card-text>
			<v-container>
				<v-row>
					<v-col cols="12" sm="12" md="6">
						<v-text-field
							:label="$t('fields.name') + '*'"
							:rules="[requiredRule]"
							v-model="model.name"
						></v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="6">
						<v-text-field :label="$t('fields.race')" v-model="model.race"></v-text-field>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12" sm="12" md="6">
						<v-text-field :label="$t('fields.class')" v-model="model.classes"></v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="6">
						<v-text-field :label="$t('fields.role')" v-model="model.role"></v-text-field>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12" sm="12" md="6">
						<v-radio-group v-model="model.isNPC" column mandatory>
							<v-radio :label="$t('fields.player')" :value="false"></v-radio>
							<v-radio :label="$t('fields.npc')" :value="true"></v-radio>
						</v-radio-group>
					</v-col>
					<v-col cols="12" sm="12" md="6">
						<v-checkbox v-model="model.isAlive" :label="$t('fields.alive')"></v-checkbox>
					</v-col>
				</v-row>
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
import { CardCategory, Character, ID } from "@/js/types";
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

function factory(): Character {
	return {
		_category: CardCategory.Character,
		id: utilities.uid(),
		desc: "",
		tags: [],
		name: "",
		race: "",
		classes: "",
		role: "",
		isAlive: true,
		isNPC: true,
	};
}

const { model, isValid, submit, reset } = useForm<Character>(form, CardCategory.Character, factory, {
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
