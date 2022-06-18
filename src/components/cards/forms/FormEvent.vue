<template>
	<v-form v-model="valid" ref="form">
		<!-- Show title if "Add" form version -->
		<v-card-title v-if="edit === undefined" class="justify-center">
			<v-icon>{{ categoryIcon }}</v-icon>
			<span class="mx-2">{{ $t("dialogs.addEvent") }}</span>
		</v-card-title>
		<v-card-text>
			<v-container>
				<v-textarea
					outlined
					auto-grow
					:label="$t('fields.desc') + '*'"
					:hint="$t('fields.mdSupport')"
					:rules="requiredRule"
					v-model="model.desc"
				></v-textarea>
				<v-row>
					<v-col cols="12" sm="12" md="6">
						<v-autocomplete
							chips
							:label="$t('fields.eventType') + '*'"
							v-model="model.type"
							:rules="requiredRule"
							:items="eventTypes"
						>
							<template v-slot:selection="data">
								<v-chip>
									<v-icon left>{{ icons[data.item] }}</v-icon>
									{{ $t(`eventTypes.${data.item}`) }}
								</v-chip>
							</template>
							<template v-slot:item="data">
								<v-icon left>{{ icons[data.item] }}</v-icon>
								{{ $t(`eventTypes.${data.item}`) }}
							</template>
						</v-autocomplete>
					</v-col>
					<v-col cols="12" sm="12" md="6">
						<v-text-field
							:prefix="$t('status.day')"
							:label="$t('fields.eventDay') + '*'"
							type="number"
							min="0"
							v-model="model.day"
							:rules="dayRange"
						></v-text-field>
					</v-col>
				</v-row>
				<TagListPanel v-model="model.tags" :exclude-id="model.id" />
			</v-container>
			<small>{{ "*" + $t("fields.requiredField") }}</small>
		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn text @click="close">{{ $t("actions.close") }}</v-btn>
			<v-btn color="primary" text :disabled="!valid" @click="submit">{{ $t("actions.save") }}</v-btn>
		</v-card-actions>
	</v-form>
</template>

<script lang="ts">
import Vue from "vue";
import form from "@/mixins/form";
import { Event, EventType, Icon } from "@/js/types";

export default Vue.extend({
	mixins: [form],
	data: function() {
		return {
			dayRange: [
				(v: string) => {
					const val = Number(v);
					return (Number.isSafeInteger(val) && val >= 0) || this.$t("fields.dayNotValid");
				},
			],
			icons: Icon,
			eventTypes: Object.values(EventType),
		};
	},
	methods: {
		/**
		 * Override of mixin method
		 */
		castCardData(card: Event): Event {
			card.day = Number(card.day);	// Ensure day if a Number and not a string
			return card;
		},
	},
});
</script>
