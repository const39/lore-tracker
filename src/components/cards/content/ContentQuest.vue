<template>
	<!-- Surrounding <div> necessary to avoid "bouncing" effect when transitioning with Form component -->
	<div>
		<v-card-actions class="float-right">
			<v-tooltip v-if="fullyComplete" location="top">
				<template v-slot:activator="{ props }">
					<v-icon class="float-right" v-bind="props">{{ icons.questCompleted }}</v-icon>
				</template>
				<span>{{ $t("fields.completed") }}</span>
			</v-tooltip>
		</v-card-actions>
		<v-card-text class="pa-3">
			<p class="text-h6">{{ itemData.title }}</p>
			<div class="pa-3">
				<v-row v-for="(task, idx) in itemData.tasks" :key="idx" class="d-flex">
					<v-tooltip location="bottom">
						<template v-slot:activator="{ props }">
							<v-icon class="ma-2" v-bind="props">
								{{ task.isCompleted ? icons.taskCompleted : icons.taskOngoing }}
							</v-icon>
						</template>
						{{ task.isCompleted ? $t("fields.completed") : $t("fields.ongoing") }}
					</v-tooltip>
					<p class="ma-2">{{ task.desc }}</p>
				</v-row>
			</div>
			<TagList class="mt-2" v-model="itemData.tags" />
		</v-card-text>
	</div>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { Icon as icons, Quest } from "@/js/types";
import { computed } from "vue";

import TagList from "../tags/TagList.vue";

const props = defineProps<{
	itemData: Quest;
}>();

const fullyComplete = computed(() => props.itemData.tasks.every((entry) => entry.isCompleted));
</script>
