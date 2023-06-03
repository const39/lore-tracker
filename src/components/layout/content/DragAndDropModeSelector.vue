<template>
	<div class="text-center">
		<div class="pa-2 text-center text-caption text-grey">
			<v-icon icon="mdi-selection-drag" />
			{{ $t("dragAndDrop.desc") }}
		</div>
		<div>
			<v-btn-toggle
				v-model="selection"
				:disabled="disableSelector"
				color="purple-lighten-1"
				variant="outlined"
				divided
				mandatory
			>
				<v-tooltip location="bottom">
					<template #activator="{ props }">
						<v-btn v-bind="props" :value="modes[0]" size="small" icon="mdi-cancel" />
					</template>
					{{ $t(`dragAndDrop.modes.${modes[0]}`) }}
				</v-tooltip>
				<v-tooltip location="bottom">
					<template #activator="{ props }">
						<v-btn
							v-bind="props"
							:value="modes[1]"
							size="small"
							icon="mdi-folder-move"
						/>
					</template>
					<div class="text-center">
						{{ $t(`dragAndDrop.modes.${modes[1]}`) }}
						<br>
						({{ $t("options.hotkeys.hold") + " Ctrl" }})
					</div>
				</v-tooltip>
				<v-tooltip location="bottom">
					<template #activator="{ props }">
						<v-btn
							v-bind="props"
							:value="modes[2]"
							:disabled="disabledModes.includes(modes[2])"
							size="small"
							icon="mdi-sort"
						/>
					</template>
					<div class="text-center">
						{{ $t(`dragAndDrop.modes.${modes[2]}`) }}
						<br>
						({{ $t("options.hotkeys.hold") + " Ctrl+Alt" }})
					</div>
				</v-tooltip>
				<v-tooltip location="bottom">
					<template #activator="{ props }">
						<v-btn
							v-bind="props"
							:value="modes[3]"
							size="small"
							icon="mdi-link-variant"
							disabled
						/>
					</template>
					{{ $t(`dragAndDrop.modes.${modes[3]}`) }}
				</v-tooltip>
			</v-btn-toggle>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onKeyStroke, onKeyUp } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { t as $t } from "@/core/translation";
import { ModeValues as modes, useDragAndDropMode } from "@/store/dragAndDropMode";

const dndStore = useDragAndDropMode();
const { mode, disabledModes } = storeToRefs(dndStore);

const selection = computed({
	get() {
		return mode.value;
	},
	set(value) {
		dndStore.setMode(value);
	},
});

const disableSelector = computed(() => disabledModes.value === "all");

onKeyStroke(
	["Control", "Alt"],
	(e: KeyboardEvent) => {
		// Enable 'sort' mode on Ctrl+Alt hold
		if (e.ctrlKey && e.altKey) dndStore.setMode("sort");
		// Enable 'moveToFolder' mode on Ctrl hold
		else if (e.ctrlKey) dndStore.setMode("moveToFolder");
	},
	{ dedupe: true } // Fire event once on hold, instead of at each tick
);

// Disable when key is released
onKeyUp(["Control", "Alt"], () => {
	if (!disableSelector.value) dndStore.setMode("disabled");
});
</script>
