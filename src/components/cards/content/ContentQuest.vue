<template>
	<!-- Surrounding <div> necessary to avoid "bouncing" effect when transitioning with Form component -->
	<div>
		<v-card-text class="pa-3">
			<v-tooltip top v-if="fullyComplete">
				<template v-slot:activator="{ on, attrs }">
					<v-icon class="float-right" v-bind="attrs" v-on="on">{{ icons.questCompleted }}</v-icon>
				</template>
				<span>{{ $t("fields.completed") }}</span>
			</v-tooltip>
			<p class="text-h6 text--primary">{{ itemData.title }}</p>
			<div class="pa-3">
				<v-row v-for="(task, idx) in itemData.tasks" :key="idx" class="d-flex">
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-icon class="ma-2" v-on="on">
								{{ task.isCompleted ? icons.taskCompleted : icons.taskOngoing }}
							</v-icon>
						</template>
						{{ task.isCompleted ? $t("fields.completed") : $t("fields.ongoing") }}
					</v-tooltip>
					<p class="ma-2 text--primary">{{ task.desc }}</p>
				</v-row>
			</div>
			<TagList class="mt-2" v-model="itemData.tags" />
		</v-card-text>
	</div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Icon, Quest } from "@/js/types";

import TagList from "../tags/TagList.vue";

export default Vue.extend({
	name: "ContentQuest",
	components: {
		TagList,
	},
	props: {
		itemData: {
			type: Object as PropType<Quest>,
			required: true,
		},
	},
	data() {
		return {
			icons: Icon,
		};
	},
	computed: {
		fullyComplete() {
			return this.itemData.tasks.every((entry) => entry.isCompleted);
		},
	},
});
</script>
