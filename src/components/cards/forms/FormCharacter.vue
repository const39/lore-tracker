<template>
	<!-- Show title if "Add" form version -->
	<v-card-title v-if="props.variant === 'add'" class="justify-center">
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
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { Character } from "@/js/types";
import utilities from "@/js/utilities";
import { required } from "@/js/validationRules";
import { computed } from "vue";
import TagListPanel from "../tags/TagListPanel.vue";

const props = defineProps<{
	modelValue: Character; // v-model
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
