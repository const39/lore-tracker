<template>
	<!-- Surrounding <div> necessary to avoid "bouncing" effect when transitioning with Form component -->
	<div>
		<v-card-actions class="float-right">
			<v-tooltip v-if="fullyComplete" location="top">
				<template #activator="{ props: tooltipProps }">
					<v-icon v-bind="tooltipProps" :icon="Icon.questCompleted" class="float-right" />
				</template>
				<span>{{ $t("fields.completed") }}</span>
			</v-tooltip>
		</v-card-actions>
		<v-card-text class="pa-3">
			<p class="text-h6">
				{{ itemData.title }}
			</p>
			<div class="pa-3">
				<v-row v-for="(task, idx) in itemData.tasks" :key="idx" class="d-flex">
					<v-tooltip location="bottom">
						<template #activator="{ props: tooltipProps }">
							<v-icon class="ma-2" v-bind="tooltipProps">
								{{ task.isCompleted ? Icon.taskCompleted : Icon.taskOngoing }}
							</v-icon>
						</template>
						{{ task.isCompleted ? $t("fields.completed") : $t("fields.ongoing") }}
					</v-tooltip>
					<p class="ma-2">
						{{ task.desc }}
					</p>
				</v-row>
			</div>
			<!-- eslint-disable-next-line vue/no-mutating-props - Editable is false so tags is not mutated -->
			<TagList v-model="itemData.tags" :editable="false" />
		</v-card-text>
	</div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Icon } from "@/core/constants";
import { Quest } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import TagList from "../tags/TagList.vue";

const props = defineProps<{
	itemData: Quest;
}>();

const fullyComplete = computed(() => props.itemData.tasks.every((entry) => entry.isCompleted));
</script>
