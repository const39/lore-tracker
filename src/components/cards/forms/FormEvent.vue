<template>
	<!-- Show title if "Add" form version -->
	<v-card-title v-if="props.variant === 'add'" class="justify-center">
		<v-icon>{{ categoryIcon }}</v-icon>
		<span class="mx-2">{{ $t("dialogs.addEvent") }}</span>
	</v-card-title>
	<v-card-text>
		<v-container>
			<v-textarea
				v-model="model.desc"
				:label="$t('fields.desc') + '*'"
				:hint="$t('fields.mdSupport')"
				:rules="[rules.required]"
				variant="outlined"
				auto-grow
			></v-textarea>
			<v-row>
				<v-col cols="12" sm="12" md="6">
					<v-select
						v-model="model.type"
						:label="$t('fields.eventType') + '*'"
						:rules="[rules.required]"
						:items="eventTypes"
						chips
					>
						<template v-slot:chip="{ props, item }">
							<v-chip v-bind="props">
								<v-icon :icon="icons[item.raw as keyof typeof icons]" start></v-icon>
								{{ $t(`eventTypes.${item.raw}`) }}
							</v-chip>
						</template>
						<template v-slot:item="{ props, item }">
							<v-list-item
								v-bind="props"
								:prepend-icon="icons[item.raw as keyof typeof icons]"
								:title="$t(`eventTypes.${item.raw}`)"
							></v-list-item>
						</template>
					</v-select>
				</v-col>
				<v-col cols="12" sm="12" md="6">
					<v-text-field
						v-model.number="model.day"
						:prefix="$t('status.day')"
						:label="$t('fields.eventDay') + '*'"
						:rules="[rules.dayRange]"
						type="number"
						min="0"
					></v-text-field>
				</v-col>
			</v-row>
			<TagListPanel v-model="model.tags" :exclude-id="model.id" />
		</v-container>
		<small>{{ "*" + $t("fields.requiredField") }}</small>
	</v-card-text>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { Event, EventType, Icon as icons } from "@/js/types";
import { number, numberInRange, required } from "@/js/validationRules";
import { computed } from "vue";
import TagListPanel from "../tags/TagListPanel.vue";
import utilities from "@/js/utilities";

const props = defineProps<{
	modelValue: Event; // v-model
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
const eventTypes = Object.values(EventType);

const rules = {
	required: required($t("fields.requiredField")),
	isNumber: number($t("fields.dayNotValid")),
	dayRange: numberInRange($t("fields.dayNotValid"), 0),
};
</script>
