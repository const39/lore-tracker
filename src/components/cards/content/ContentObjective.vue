<template>
	<!-- Surrounding <div> necessary to avoid "bouncing" effect when transitioning with Form component -->
	<div>
		<v-card-actions class="float-right">
			<v-tooltip top v-if="fullyComplete">
				<template v-slot:activator="{ on, attrs }">
					<v-icon v-bind="attrs" v-on="on">{{ icons.objectiveCompleted }}</v-icon>
				</template>
				<span>{{ $t("fields.completed") }}</span>
			</v-tooltip>
		</v-card-actions>
		<v-card-text class="pa-3">
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
			<TagList :items="itemData.tags" />
		</v-card-text>
	</div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Icon, Objective } from "@/js/types";

import TagList from "../tags/TagList.vue";

export default Vue.extend({
	name: "ContentObjective",
	components: {
		TagList,
	},
	props: {
		itemData: {
			type: Object as PropType<Objective>,
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
