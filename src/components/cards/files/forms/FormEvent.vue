<template>
	<v-textarea
		v-model="model.desc"
		:label="$t('pages.loreBook.fields.labels.desc') + '*'"
		:hint="$t('pages.loreBook.fields.labels.mdSupport')"
		:rules="[rules.required]"
		variant="outlined"
		auto-grow
	/>
	<v-row>
		<v-col cols="12" sm="12" md="6">
			<v-select
				v-model="model.type"
				:label="$t('pages.loreBook.fields.labels.eventType') + '*'"
				:rules="[rules.required]"
				:items="eventTypes"
				chips
			>
				<template #chip="{ props: chipProps, item }">
					<v-chip v-bind="chipProps">
						<v-icon :icon="Icon[item.raw as keyof typeof Icon]" start />
						{{ $t(`data.eventTypes.${item.raw}`) }}
					</v-chip>
				</template>
				<template #item="{ props: itemProps, item }">
					<v-list-item
						v-bind="itemProps"
						:prepend-icon="Icon[item.raw as keyof typeof Icon]"
						:title="$t(`data.eventTypes.${item.raw}`)"
					/>
				</template>
			</v-select>
		</v-col>
		<v-col cols="12" sm="12" md="6">
			<v-text-field
				v-model.number="model.day"
				:prefix="$t('data.campaign.day')"
				:label="$t('pages.loreBook.fields.labels.eventDay') + '*'"
				:rules="[rules.dayRange]"
				type="number"
				min="0"
			/>
		</v-col>
	</v-row>
	<TagListPanel v-model="model.tags" :exclude-id="model.id" />
</template>

<script lang="ts" setup>
import TagListPanel from "@/components/cards/tags/TagListPanel.vue";
import { Event, EventType } from "@/core/models";
import { t as $t } from "@/core/translation";
import { Icon } from "@/core/utils/icons";
import { number, numberInRange, required } from "@/core/validationRules";

const model = defineModel<Event>({ required: true }); // v-model

const eventTypes = Object.values(EventType);

const rules = {
	required: required($t("pages.loreBook.fields.errors.requiredField")),
	isNumber: number($t("pages.loreBook.fields.errors.dayNotValid")),
	dayRange: numberInRange($t("pages.loreBook.fields.errors.dayNotValid"), 0),
};
</script>
