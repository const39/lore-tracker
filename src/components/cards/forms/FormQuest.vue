<template>
	<v-form v-model="valid" ref="form">
		<!-- Show title if "Add" form version -->
		<v-card-title v-if="edit === undefined" class="justify-center">
			<v-icon>{{ categoryIcon }}</v-icon>
			<span class="mx-2">{{ $t("dialogs.addQuest") }}</span>
		</v-card-title>
		<v-card-text>
			<v-container>
				<v-text-field
					:label="$t('fields.title') + '*'"
					:rules="requiredRule"
					v-model="model.title"
				></v-text-field>
				<ListPanel
					:title="$t('fields.tasks')"
					:empty-content-text="$t('fields.noTask')"
					:is-filled="model.tasks.length > 0"
				>
					<template v-slot:action>
						<v-btn icon @click="addTask">
							<v-icon>mdi-plus</v-icon>
						</v-btn>
					</template>
					<v-text-field
						v-for="(task, idx) in model.tasks"
						:key="idx"
						v-model="task.desc"
						append-icon="mdi-close"
						@click:append="remove(idx)"
					>
						<template v-slot:prepend>
							<v-tooltip bottom>
								<template v-slot:activator="{ on }">
									<v-icon v-on="on" @click="complete(idx)">
										{{ task.isCompleted ? icons.taskCompleted : icons.taskOngoing }}
									</v-icon>
								</template>
								{{ task.isCompleted ? $t("fields.completed") : $t("fields.ongoing") }}
							</v-tooltip>
						</template>
					</v-text-field>
				</ListPanel>
				<TagListPanel v-model="model.tags" :exclude-id="model.id" />
			</v-container>
			<small>{{ "*" + $t("fields.requiredField") }}</small>
		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn text @click="close">{{ $t("actions.close") }}</v-btn>
			<v-btn
				color="primary"
				text
				:disabled="!valid"
				@click="
					cleanInput();
					submit();
				"
				>{{ $t("actions.save") }}</v-btn
			>
		</v-card-actions>
	</v-form>
</template>

<script lang="ts">
import form from "@/mixins/form";
import { Icon, Task } from "@/js/types";

import ListPanel from "@/components/ListPanel.vue";

// Directly extend from the mixin instead of Vue to provide the mixin types to TypeScript 
export default form.extend({
	mixins: [form],
	components: {
		ListPanel,
	},
	data() {
		return {
			icons: Icon,
		};
	},
	methods: {
		addTask(): void {
			const task: Task = {
				desc: "",
				isCompleted: false,
			};
			this.model.tasks.push(task);
		},
		complete(idx: number): void {
			this.model.tasks[idx].isCompleted = !this.model.tasks[idx].isCompleted;
		},
		remove(idx: number): void {
			if (idx in this.model.tasks) this.model.tasks.splice(idx, 1);
		},
		cleanInput(): void {
			// Remove empty tasks
			this.model.tasks = this.model.tasks.filter((task: Task) => task.desc.trim());
		},
	},
});
</script>
<style scoped>
.border {
	border: 1px solid black;
}
</style>
