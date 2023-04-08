<template>
	<v-form v-model="isValid" ref="form">
		<!-- Show title if "Add" form version -->
		<v-card-title v-if="props.edit === undefined" class="justify-center">
			<v-icon>{{ categoryIcon }}</v-icon>
			<span class="mx-2">{{ $t("dialogs.addQuest") }}</span>
		</v-card-title>
		<v-card-text>
			<v-container>
				<v-text-field
					:label="$t('fields.title') + '*'"
					:rules="[requiredRule]"
					v-model="model.title"
				></v-text-field>
				<ListPanel
					:title="$t('fields.tasks')"
					:empty-content-text="$t('fields.noTask')"
					:is-filled="model.tasks.length > 0"
				>
					<template v-slot:action>
						<v-btn variant="text" density="compact" icon="mdi-plus" @click="addTask"> </v-btn>
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
			<v-btn color="primary" variant="text" :disabled="!isValid" @click="onSubmit">
				{{ $t("actions.save") }}
			</v-btn>
		</v-card-actions>
	</v-form>
</template>

<script lang="ts" setup>
import ListPanel from "@/components/ListPanel.vue";
import { t as $t } from "@/js/translation";
import { CardCategory, ID, Quest, Task, Icon as icons } from "@/js/types";
import utilities from "@/js/utilities";
import { required } from "@/js/validationRules";
import { useForm } from "@/composables/form";
import { ref } from "vue";
import type { VForm } from "vuetify/components";
import TagListPanel from "../tags/TagListPanel.vue";

const props = defineProps<{
	edit?: ID; // [Optional] leave undefined to use the "Add" form instead of "Edit" form
}>();

const emit = defineEmits<{
	(e: "close"): void;
}>();

const requiredRule = required($t("fields.requiredField"));
const form = ref<VForm | undefined>(undefined);

function factory(): Quest {
	return {
		_category: CardCategory.Quest,
		id: utilities.uid(),
		tags: [],
		title: "",
		tasks: [],
	};
}

const { model, isValid, submit, reset } = useForm<Quest>(form, CardCategory.Quest, factory, {
	edit: props.edit,
});

const categoryIcon = utilities.getIcon(model.value);

function onSubmit() {
	// Use callback instead of promise because the parent container will not catch the 'close' event for some reason
	submit(() => close())
}

function close() {
	cleanInput();
	reset();
	// Fire a custom event to the parent component. The parent can decide to catch this event to react to the user action.
	emit("close");
}

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
</script>

<style scoped>
.border {
	border: 1px solid black;
}
</style>
