<template>
	<!-- Surrounding <div> necessary to avoid "bouncing" effect when transitioning with Form component -->
	<div>
		<v-card-text class="pa-3">
			<p class="text-h6">
				{{ itemData.name }}
				<v-tooltip location="top" v-if="!itemData.isAlive">
					<template v-slot:activator="{ props }">
						<v-icon v-bind="props">mdi-skull</v-icon>
					</template>
					<span>{{ $t("fields.dead") }}</span>
				</v-tooltip>
				<v-chip label size="x-small"> {{ itemData.isNPC ? $t("fields.npc") : $t("fields.player") }} </v-chip>
			</p>
			<p class="text-subtitle-2 text-truncate">{{ identity }}</p>
			<MarkdownView :text="itemData.desc" />
			<TagList v-model="itemData.tags" />
		</v-card-text>
	</div>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { computed } from "vue";
import { Character } from "@/js/types";

import TagList from "../tags/TagList.vue";
import MarkdownView from "../../MarkdownView.vue";

const props = defineProps<{
	itemData: Character;
}>();

const identity = computed(() => {
	let race = props.itemData.race || $t("fields.unknownRace");
	let classes = props.itemData.classes || $t("fields.unknownClass");
	let role = props.itemData.role || $t("fields.unknownRole");

	return `${race} - ${classes} (${role})`;
});
</script>
