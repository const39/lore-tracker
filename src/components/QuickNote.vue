<template>
	<div>
		<v-fab-transition origin="bottom right">
			<v-card v-if="open">
				<v-card-text>
					<div class="d-flex justify-space-between">
						<v-btn
							class="resizing-handle"
							icon
							@mousedown="onHold"
							@mousemove="resize"
							@mouseup="resizing = false"
						>
							<v-icon>mdi-cursor-move</v-icon>
						</v-btn>
						<p class="text-h6 text--primary">{{ $t("actions.quickNote") }}</p>
						<v-btn icon @click="open = false">
							<v-icon>mdi-chevron-down</v-icon>
						</v-btn>
					</div>
					<v-textarea
						id="resizable"
						outlined
						auto-grow
						autofocus
						:hint="$t('fields.mdSupport')"
						v-model="text"
					></v-textarea>
				</v-card-text>
			</v-card>
			<v-btn v-else fab color="primary" @click="open = true">
				<v-icon>mdi-text-box-edit</v-icon>
			</v-btn>
		</v-fab-transition>
	</div>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { useStore } from "@/store";
import { computed, ref } from "vue";

const open = ref(false);
const resizing = ref(false);

const store = useStore();

const interaction = {
	originalW: 0,
	originalH: 0,
	originalX: 0,
	originalY: 0,
	originalMouseX: 0,
	originalMouseY: 0,
};

function onHold(e: MouseEvent) {
	const element = document.getElementById("resizable") as HTMLElement;
	e.preventDefault();
	interaction.originalW = Number.parseFloat(
		getComputedStyle(element, null).getPropertyValue("width").replace("px", "")
	);
	interaction.originalH = Number.parseFloat(
		getComputedStyle(element, null).getPropertyValue("height").replace("px", "")
	);
	interaction.originalX = element.getBoundingClientRect().left;
	interaction.originalY = element.getBoundingClientRect().top;
	interaction.originalMouseX = e.pageX;
	interaction.originalMouseY = e.pageY;

	resizing.value = true;
}

function resize(e: MouseEvent) {
	const element = document.getElementById("resizable") as HTMLElement;
	const MIN_SIZE = 20;
	if (resizing.value) {
		const width = interaction.originalW - (e.pageX - interaction.originalMouseX);
		const height = interaction.originalH - (e.pageY - interaction.originalMouseY);
		if (width > MIN_SIZE) {
			element.style.width = width + "px";
			element.style.left = interaction.originalX + (e.pageX - interaction.originalMouseX) + "px";
		}
		if (height > MIN_SIZE) {
			element.style.height = height + "px";
			element.style.top = interaction.originalY + (e.pageY - interaction.originalMouseY) + "px";
		}
	}
}

const text = computed({
	get() {
		return store.quickNote;
	},
	set(value) {
		store.commitAndSave({ commit: "setQuickNote", payload: value });
	},
});
</script>

<style scoped>
.resizing-handle {
	cursor: nw-resize;
}
</style>
