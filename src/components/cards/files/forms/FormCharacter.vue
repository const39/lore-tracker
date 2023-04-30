<template>
	<!-- Show title if "Add" form version -->
	<v-card-title v-if="props.variant === 'add'" class="justify-center">
		<v-icon :icon="categoryIcon" />
		<span class="mx-2">{{ $t("dialogs.addCharacter") }}</span>
	</v-card-title>
	<v-card-text>
		<v-container>
			<v-row>
				<v-col cols="12" sm="12" md="6">
					<v-text-field
						v-model="model.name"
						:label="$t('fields.name') + '*'"
						:rules="[requiredRule]"
					/>
				</v-col>
				<v-col cols="12" sm="12" md="6">
					<v-text-field v-model="model.race" :label="$t('fields.race')" />
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="12" sm="12" md="6">
					<v-text-field v-model="model.classes" :label="$t('fields.class')" />
				</v-col>
				<v-col cols="12" sm="12" md="6">
					<v-text-field v-model="model.role" :label="$t('fields.role')" />
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="12" sm="12" md="6">
					<v-radio-group v-model="model.isNPC" column mandatory>
						<v-radio :label="$t('fields.player')" :value="false" />
						<v-radio :label="$t('fields.npc')" :value="true" />
					</v-radio-group>
				</v-col>
				<v-col cols="12" sm="12" md="6">
					<v-checkbox v-model="model.isAlive" :label="$t('fields.alive')" />
				</v-col>
			</v-row>
			<v-textarea
				v-model="model.desc"
				:label="$t('fields.desc')"
				:hint="$t('fields.mdSupport')"
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
import TagListPanel from "@/components/cards/tags/TagListPanel.vue";
import { Character } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import utilities from "@/core/utilities";
import { required } from "@/core/validationRules";

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
