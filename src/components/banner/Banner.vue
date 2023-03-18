<template>
	<v-row class="my-3 d-flex align-center">
		<div>
			<v-hover v-slot="{ isHovering, props }">
				<div class="text-xl-h4 mb-2" v-bind="props">
					<v-form v-if="editName">
						<v-text-field
							autofocus
							v-model="campaignName"
							counter
							maxlength="30"
							:rules="rules"
							append-inner-icon="mdi-check"
							@click:append-inner="editName = false"
							@keypress.enter="editName = false"
						></v-text-field>
					</v-form>
					<span v-else>
						{{ campaignName }}
						<v-icon v-show="isHovering" size="x-small" icon="mdi-pencil" @click="editName = true"></v-icon>
					</span>
				</div>
			</v-hover>

			<StatusTray />
		</div>
		<v-spacer></v-spacer>
		<div class="text-right">
			<SearchView class="mt-1 mb-2" />
			<span class="text-grey text-caption">{{ cardCount + $t("status.cardCount") }}</span>
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

const rules = [(v: string) => !!v || $t("fields.requiredField"), (v: string) => v.length <= 30 || "30 max."];
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
