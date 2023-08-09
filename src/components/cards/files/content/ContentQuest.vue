<template>
	<v-card-actions class="float-right">
		<v-tooltip v-if="fullyComplete" location="top">
			<template #activator="{ props: tooltipProps }">
				<v-icon v-bind="tooltipProps" :icon="Icon.questCompleted" class="float-right" />
			</template>
			<span>{{ $t("pages.loreBook.fields.labels.completed") }}</span>
		</v-tooltip>
	</v-card-actions>
	<v-card-text class="pa-3">
		<p class="text-h6">
			{{ itemData.title }}
		</p>
		<MarkdownView :text="itemData.desc" />
		<div class="my-2">
			<div v-for="(task, idx) in itemData.tasks" :key="idx" class="d-flex">
				<v-tooltip location="bottom">
					<template #activator="{ props: tooltipProps }">
						<v-icon class="ma-2" v-bind="tooltipProps">
							{{ task.isCompleted ? Icon.taskCompleted : Icon.taskOngoing }}
						</v-icon>
					</template>
					{{
						task.isCompleted
							? $t("pages.loreBook.fields.labels.completed")
							: $t("pages.loreBook.fields.labels.ongoing")
					}}
				</v-tooltip>
				<p class="pa-2">
					{{ task.desc }}
				</p>
			</div>
		</div>
		<!-- eslint-disable-next-line vue/no-mutating-props - Editable is false so tags is not mutated -->
		<TagList v-model="itemData.tags" :editable="false" />
	</v-card-text>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import TagList from "@/components/cards/tags/TagList.vue";
import MarkdownView from "@/components/common/MarkdownView.vue";
import { Quest } from "@/core/models";
import { t as $t } from "@/core/translation";
import { Icon } from "@/core/utils/icons";

const props = defineProps<{
	itemData: Quest;
}>();

const fullyComplete = computed(() => props.itemData.tasks.every((entry) => entry.isCompleted));
</script>
