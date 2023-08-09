<template>
	<v-card-text class="pa-3">
		<p class="text-h6">
			{{ itemData.name }}
			<v-tooltip v-if="!itemData.isAlive" location="top">
				<template #activator="{ props: tooltipProps }">
					<v-icon v-bind="tooltipProps" icon="mdi-skull" start />
				</template>
				<span>{{ $t("pages.loreBook.fields.labels.dead") }}</span>
			</v-tooltip>
			<v-chip size="x-small" label>
				{{
					itemData.isNPC
						? $t("pages.loreBook.fields.labels.npc")
						: $t("pages.loreBook.fields.labels.player")
				}}
			</v-chip>
		</p>
		<p class="text-subtitle-2 text-truncate">
			{{ identity }}
		</p>
		<MarkdownView :text="itemData.desc" />
		<!-- eslint-disable-next-line vue/no-mutating-props - Editable is false so tags is not mutated -->
		<TagList v-model="itemData.tags" :editable="false" />
	</v-card-text>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import TagList from "@/components/cards/tags/TagList.vue";
import MarkdownView from "@/components/common/MarkdownView.vue";
import { Character } from "@/core/models";
import { t as $t } from "@/core/translation";

const props = defineProps<{
	itemData: Character;
}>();

const identity = computed(() => {
	const race = props.itemData.race || $t("pages.loreBook.fields.labels.unknownRace");
	const classes = props.itemData.classes || $t("pages.loreBook.fields.labels.unknownClass");
	const role = props.itemData.role || $t("pages.loreBook.fields.labels.unknownRole");

	return `${race} - ${classes} (${role})`;
});
</script>
