<template>
	<v-form v-model="valid" ref="form">
		<!-- Show title if "Add" form version -->
		<v-card-title v-if="props.edit === undefined" class="justify-center">
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
							<v-tooltip location="bottom">
								<template v-slot:activator="{ props }">
									<v-icon v-bind="props" @click="complete(idx)">
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
			<v-btn variant="text" @click="close">{{ $t("actions.close") }}</v-btn>
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

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { CardCategory, Quest, Icon as icons, Task } from "@/js/types";
import ListPanel from "@/components/ListPanel.vue";
import utilities from "@/js/utilities";
import { useForm, type FormProps } from "@/mixins/form";
import { ref } from "vue";
import type { VForm } from "vuetify/components";

const form = ref<VForm | undefined>(undefined);

function addTask(): void {
	const task: Task = {
		desc: "",
		isCompleted: false,
	};
	model.value.tasks.push(task);
}
function complete(idx: number): void {
	model.value.tasks[idx].isCompleted = !model.value.tasks[idx].isCompleted;
}
function remove(idx: number): void {
	if (idx in model.value.tasks) model.value.tasks.splice(idx, 1);
}
function cleanInput(): void {
	// Remove empty tasks
	model.value.tasks = model.value.tasks.filter((task: Task) => task.desc.trim());
}

function factory(): Quest {
	return {
		_category: CardCategory.Quest,
		id: utilities.uid(),
		tags: [],
		title: "",
		tasks: [],
	};
}

const { props, valid, model, requiredRule, categoryIcon, submit, close } = useForm<Quest>(factory, form);
</script>

<style scoped>
.border {
	border: 1px solid black;
}
</style>
