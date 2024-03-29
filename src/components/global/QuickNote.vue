<template>
	<div>
		<v-fab-transition origin="bottom right">
			<v-card v-if="open" class="scrollable">
				<v-card-text>
					<div class="d-flex justify-space-between align-center mb-2">
						<v-btn
							class="resizing-handle"
							variant="plain"
							icon="mdi-cursor-move"
							@mousedown="startResize"
							@mousemove="resize"
							@mouseup="stopResize"
						/>
						<p class="text-h6">
							{{ $t("pages.loreBook.quickNote.name") }}
						</p>
						<v-btn variant="plain" icon="mdi-chevron-down" @click="open = false" />
					</div>
					<v-textarea
						ref="el"
						v-model="content"
						:hint="$t('pages.loreBook.fields.labels.mdSupport')"
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
import { useDebounceFn, useElementSize, useWindowSize } from "@vueuse/core";
import { useRepo } from "pinia-orm";
import { VNodeRef, computed, ref, watch } from "vue";
import { Campaign } from "@/core/models";
import { CampaignRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import { usePreferencesStore } from "@/store/preferences";

const props = defineProps<{
	campaign: Campaign;
}>();

const open = ref(false);
const resizing = ref(false);
const el = ref<VNodeRef | null>(null); // Vuetify underlying element

/**
 * QuickNote text area DOM element
 */
const element = computed<HTMLElement | undefined>(() => el.value?.$el);

const campaignRepo = useRepo(CampaignRepo);
const prefStore = usePreferencesStore();
const { width: windowWidth, height: windowHeight } = useWindowSize(); // Reactive window size
const elementSize = useElementSize(element); // Reactive element size

const content = computed({
	get() {
		return props.campaign.quickNote;
	},
	set(value) {
		saveContent(value);
	},
});

// Update the quick note's content 800ms after the user finished typing
const saveContent = useDebounceFn((content?: string) => {
	campaignRepo.update({ id: props.campaign.id, quickNote: content ?? "" });
}, 800);

const size = computed({
	get() {
		// Return element size obtained from reactive composable
		return {
			width: elementSize.width.value,
			height: elementSize.height.value,
		};
	},
	set({ width, height }) {
		if (element.value) {
			// Set and save element width if it is within bounds
			if (width > bounds.value.minWidth && width < bounds.value.maxWidth) {
				element.value.style.width = width + "px";
				prefStore.quickNoteSize = { ...prefStore.quickNoteSize, width };
			}
			// Set and save element height if it is within bounds
			if (height > bounds.value.minHeight && height < bounds.value.maxHeight) {
				element.value.style.height = height + "px";
				prefStore.quickNoteSize = { ...prefStore.quickNoteSize, height };
			}
		}
	},
});

// Load element size from user preference
// -> Triggered on QuickNote opening and DOM element update (i.e. when it is effectively mounted)
watch([open, element], () => {
	const { width = -1, height = -1 } = prefStore.quickNoteSize ?? {};
	size.value = { width, height };
});

/**
 * Reactive bounds, based on the window size.
 */
const bounds = computed(() => ({
	minWidth: Math.min(windowWidth.value / 6, 200),
	maxWidth: windowWidth.value / 2,
	minHeight: Math.min(windowHeight.value / 6, 200),
	maxHeight: windowHeight.value / 2,
}));

const interaction = {
	originalW: 0,
	originalH: 0,
	originalX: 0,
	originalY: 0,
	originalMouseX: 0,
	originalMouseY: 0,
};

function startResize(e: MouseEvent) {
	if (element.value) {
		e.preventDefault();
		interaction.originalW = Number.parseFloat(
			getComputedStyle(element.value, null).getPropertyValue("width").replace("px", "")
		);
		interaction.originalH = Number.parseFloat(
			getComputedStyle(element.value, null).getPropertyValue("height").replace("px", "")
		);
		interaction.originalX = element.value.getBoundingClientRect().left;
		interaction.originalY = element.value.getBoundingClientRect().top;
		interaction.originalMouseX = e.pageX;
		interaction.originalMouseY = e.pageY;
	}

	resizing.value = true;
}

function resize(e: MouseEvent) {
	if (resizing.value && element.value) {
		const width = interaction.originalW - (e.pageX - interaction.originalMouseX);
		const height = interaction.originalH - (e.pageY - interaction.originalMouseY);
		size.value = { width, height };
	}
}

function stopResize() {
	resizing.value = false;
}
</script>

<style scoped>
.resizing-handle {
	cursor: nw-resize;
}
</style>
