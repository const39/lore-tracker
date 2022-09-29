<template>
	<v-row class="my-3 d-flex align-center">
		<div>
			<v-hover v-slot="{ hover }">
				<div class="text-xl-h4 mb-2">
					<v-form v-if="editName">
						<v-text-field
							autofocus
							v-model="campaignName"
							counter
							maxlength="30"
							:rules="[rules.required, rules.counter]"
							append-outer-icon="mdi-check"
							@click:append-outer="editName = false"
							@keypress.enter="editName = false"
						></v-text-field>
					</v-form>
					<span v-else>
						{{ campaignName }}
						<v-icon v-show="hover" @click="editName = true">mdi-pencil</v-icon>
					</span>
				</div>
			</v-hover>

			<StatusTray />
		</div>
		<v-spacer></v-spacer>
		<div class="text-right">
			<SearchView class="mt-1 mb-2" />
			<span class="grey--text text-caption">{{ cardCount + $t("status.cardCount") }}</span>
		</div>

		<v-divider vertical class="ml-3 mr-1"></v-divider>
		<div>
			<slot name="actions"></slot>
		</div>
	</v-row>
</template>

<script lang="ts">
import Vue from "vue";

import StatusTray from "./StatusTray.vue";
import SearchView from "@/components/SearchView.vue";

export default Vue.extend({
	components: {
		StatusTray,
		SearchView,
	},
	data() {
		return {
			editName: false,
			rules: {
				required: (v: string) => !!v || this.$t("fields.requiredField"),
				counter: (v: string) => v.length <= 30 || "30 max.",
			},
		};
	},
	computed: {
		cardCount(): number {
			return this.$store.getters.cardCount;
		},
		campaignName: {
			get() {
				return this.$store.state.name;
			},
			set(value) {
				if (value) this.$store.dispatch("commitAndSave", { commit: "setName", payload: value });
			},
		},
	},
});
</script>

<style></style>
