<template>
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
						<v-icon :icon="Icon[item.raw as keyof typeof Icon]" start />
						{{ $t(`eventTypes.${item.raw}`) }}
					</v-chip>
				</template>
				<template #item="{ props: itemProps, item }">
					<v-list-item
						v-bind="itemProps"
						:prepend-icon="Icon[item.raw as keyof typeof Icon]"
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
</template>

<script lang="ts" setup>
import { computed } from "vue";
import TagListPanel from "@/components/cards/tags/TagListPanel.vue";
import { Icon } from "@/core/icons";
import { Event, EventType } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import { number, numberInRange, required } from "@/core/validationRules";

const props = defineProps<{
	modelValue: Event; // v-model
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

const eventTypes = Object.values(EventType);

const rules = {
	required: required($t("fields.requiredField")),
	isNumber: number($t("fields.dayNotValid")),
	dayRange: numberInRange($t("fields.dayNotValid"), 0),
};
</script>
