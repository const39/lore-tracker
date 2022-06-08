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
				<v-card outlined>
					<v-card-actions class="float-right">
						<v-btn icon @click="addTask">
							<v-icon>mdi-plus</v-icon>
						</v-btn>
					</v-card-actions>
					<v-card-title class="text-subtitle-1 text--primary">{{ $t("fields.tasks") }}</v-card-title>
					<v-card-text v-if="model.tasks.length > 0">
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
					</v-card-text>
					<v-card-text v-else>
						<p class="mb-0 text--secondary">{{ $t("fields.noTask") }}</p>
					</v-card-text>
				</v-card>
				<TagChooser v-model="model.tags" :exclude-id="model.id" />
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
import Vue from "vue";
import form from "@/mixins/form";
import { Icon, Task } from "@/js/types";

export default Vue.extend({
	mixins: [form],
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
