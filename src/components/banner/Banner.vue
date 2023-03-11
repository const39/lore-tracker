<template>
	<v-row class="my-3 d-flex align-center">
		<div>
			<v-hover v-slot="{ isHovering }">
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
						<v-icon v-show="isHovering" @click="editName = true">mdi-pencil</v-icon>
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

<script lang="ts" setup>
import { computed, ref } from "vue";
import { t as $t } from "@/js/translation";
import { useStore } from "@/store/index";

import StatusTray from "./StatusTray.vue";
import SearchView from "@/components/SearchView.vue";

const rules = {
	required: (v: string) => !!v || $t("fields.requiredField"),
	counter: (v: string) => v.length <= 30 || "30 max.",
};
const editName = ref(false);

const store = useStore();

const cardCount = computed(() => store.cardCount);

const campaignName = computed({
	get() {
		return store.name;
	},
	set(value) {
		if (value) store.commitAndSave({ commit: "setName", payload: value });
	},
});
</script>

<style></style>
