<template>
	<!-- Show title if "Add" form version -->
	<v-card-title v-if="props.variant === 'add'" class="justify-center">
		<v-icon :icon="categoryIcon" />
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
			/>
			<v-row>
				<v-col cols="12" sm="12" md="6">
					<v-select
						v-model="model.type"
						:label="$t('fields.eventType') + '*'"
						:rules="[rules.required]"
						:items="eventTypes"
						chips
					>
						<template #chip="{ props: chipProps, item }">
							<v-chip v-bind="chipProps">
								<v-icon :icon="icons[item.raw as keyof typeof icons]" start />
								{{ $t(`eventTypes.${item.raw}`) }}
							</v-chip>
						</template>
						<template #item="{ props: itemProps, item }">
							<v-list-item
								v-bind="itemProps"
								:prepend-icon="icons[item.raw as keyof typeof icons]"
								:title="$t(`eventTypes.${item.raw}`)"
							/>
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
					/>
				</v-col>
			</v-row>
			<TagListPanel v-model="model.tags" :exclude-id="model.id" />
		</v-container>
		<small>{{ "*" + $t("fields.requiredField") }}</small>
	</v-card-text>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { t as $t } from "@/js/translation";
import { Event, EventType, Icon as icons } from "@/js/types";
import utilities from "@/js/utilities";
import { number, numberInRange, required } from "@/js/validationRules";
import TagListPanel from "../tags/TagListPanel.vue";

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
