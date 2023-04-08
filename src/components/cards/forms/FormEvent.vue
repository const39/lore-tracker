<template>
	<v-form v-model="isValid" ref="form">
		<!-- Show title if "Add" form version -->
		<v-card-title v-if="props.edit === undefined" class="justify-center">
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
									<v-icon :icon="icons[item.raw]" start></v-icon>
									{{ $t(`eventTypes.${item.raw}`) }}
								</v-chip>
							</template>
							<template v-slot:item="{ props, item }">
								<v-list-item
									v-bind="props"
									:prepend-icon="icons[item.raw]"
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
import { CardCategory, Event, EventType, ID, Icon as icons } from "@/js/types";
import utilities from "@/js/utilities";
import { number, numberInRange, required } from "@/js/validationRules";
import { useForm } from "@/composables/form";
import { useStore } from "@/store";
import { ref } from "vue";
import type { VForm } from "vuetify/components";
import TagListPanel from "../tags/TagListPanel.vue";

const props = defineProps<{
	edit?: ID; // [Optional] leave undefined to use the "Add" form instead of "Edit" form
}>();

const emit = defineEmits<{
	(e: "close"): void;
}>();

const form = ref<VForm | undefined>(undefined);

const store = useStore();

const rules = {
	required: required($t("fields.requiredField")),
	isNumber: number($t("fields.dayNotValid")),
	dayRange: numberInRange($t("fields.dayNotValid"), 0),
};

const eventTypes = Object.values(EventType);

function factory(): Event {
	return {
		_category: CardCategory.Event,
		id: utilities.uid(),
		desc: "",
		tags: [],
		type: EventType.OTHER,
		day: store.days,
	};
}

const { model, isValid, submit, reset } = useForm<Event>(form, CardCategory.Event, factory, {
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
