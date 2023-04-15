<template>
	<div>
		<v-fab-transition origin="bottom right">
			<v-card v-if="open">
				<v-card-text>
					<div class="d-flex justify-space-between align-center mb-2">
						<v-btn
							class="resizing-handle"
							variant="plain"
							icon="mdi-cursor-move"
							@mousedown="onHold"
							@mousemove="resize"
							@mouseup="resizing = false"
						/>
						<p class="text-h6">
							{{ $t("actions.quickNote") }}
						</p>
						<v-btn variant="plain" icon="mdi-chevron-down" @click="open = false" />
					</div>
					<v-textarea
						id="resizable"
						v-model="content"
						:hint="$t('fields.mdSupport')"
						variant="outlined"
						auto-grow
						autofocus
					/>
				</v-card-text>
			</v-card>
			<v-btn
				v-else
				size="large"
				icon="mdi-text-box-edit"
				color="primary"
				@click="open = true"
			/>
		</v-fab-transition>
	</div>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { useQuickNoteStore } from "@/store/quickNote";
import { computed } from "vue";
import { ref } from "vue";

const open = ref(false);
const resizing = ref(false);

const quickNoteStore = useQuickNoteStore();

const content = computed({
	get() {
		return quickNoteStore.content;
	},
	set(value) {
		quickNoteStore.content = value.trim() ?? "";
	},
});

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
			element.style.left =
				interaction.originalX + (e.pageX - interaction.originalMouseX) + "px";
		}
		if (height > MIN_SIZE) {
			element.style.height = height + "px";
			element.style.top =
				interaction.originalY + (e.pageY - interaction.originalMouseY) + "px";
		}
	}
}
</script>

<style scoped>
.resizing-handle {
	cursor: nw-resize;
}
</style>
