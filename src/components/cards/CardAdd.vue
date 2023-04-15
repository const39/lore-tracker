<template>
	<div :class="{ 'fill-height': fillHeight }">
		<v-expand-transition>
			<!-- Dynamic Form component ("Add" version) -->
			<BaseCard v-if="showForm">
				<FormWrapper :category="category" @done="closeForm"></FormWrapper>
			</BaseCard>
		</v-expand-transition>
		<v-fade-transition>
			<!-- "Add" clickable card button -->
			<v-card
				v-if="showAdd"
				variant="outlined"
				@mouseenter="hover = true"
				@mouseleave="hover = false"
				class="my-1 custom-border"
				:class="{
					'fill-height': fillHeight,
					'grey-lighten-3': hover && !isDarkTheme,
					'grey-darken-3': hover && isDarkTheme,
				}"
			>
				<v-card-text class="text-center clickable" :class="{ 'fill-height': fillHeight }" @click="openForm">
					<v-icon size="large">mdi-plus</v-icon>
				</v-card-text>
			</v-card>
		</v-fade-transition>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useTheme } from "vuetify";
import BaseCard from "./BaseCard.vue";
import FormWrapper from "./forms/FormWrapper.vue";

import { CardCategory } from "@/js/types";

defineProps<{
	category: CardCategory;
	fillHeight?: boolean; // Optional style prop
}>();

const showForm = ref(false);
const showAdd = ref(true);
const hover = ref(false);

function openForm(): void {
	showForm.value = true;
	showAdd.value = false;
}

function closeForm(): void {
	showForm.value = false;
	// HACK: Delay display of 'Add' clickable card to after the form transition completion
	setTimeout(() => (showAdd.value = true), 300);
}

const isDarkTheme = computed(() => useTheme().current.value.dark);
</script>

<style scoped>
.custom-border {
	border-style: dashed;
}
.clickable {
	display: flex;
	align-items: center;
	justify-content: center;
}
.clickable:hover {
	cursor: pointer;
}
</style>
