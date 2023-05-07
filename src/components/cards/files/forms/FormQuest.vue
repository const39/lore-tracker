<template>
	<v-text-field v-model="model.title" :label="$t('fields.title') + '*'" :rules="[requiredRule]" />
	<ListPanel
		:title="$t('fields.tasks')"
		:placeholder="$t('fields.noTask')"
		:is-filled="model.tasks.length > 0"
	>
		<template #action>
			<v-btn variant="text" density="compact" icon="mdi-plus" @click="addTask" />
		</template>
		<v-text-field
			v-for="(task, idx) in model.tasks"
			:key="idx"
			v-model="task.desc"
			:rules="[requiredRule]"
			append-icon="mdi-close"
			@click:append="remove(idx)"
		>
			<template #prepend>
				<v-tooltip location="bottom">
					<template #activator="{ props: tooltipProps }">
						<v-icon
							v-bind="tooltipProps"
							:icon="task.isCompleted ? Icon.taskCompleted : Icon.taskOngoing"
							@click="complete(idx)"
						/>
					</template>
					{{ task.isCompleted ? $t("fields.completed") : $t("fields.ongoing") }}
				</v-tooltip>
			</template>
		</v-text-field>
	</ListPanel>
	<TagListPanel v-model="model.tags" :exclude-id="model.id" />
</template>

<script lang="ts" setup>
import { computed } from "vue";
import TagListPanel from "@/components/cards/tags/TagListPanel.vue";
import ListPanel from "@/components/common/ListPanel.vue";
import { Icon } from "@/core/icons";
import { Quest, Task } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import { required } from "@/core/validationRules";

const props = defineProps<{
	modelValue: Quest; // v-model
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: typeof props.modelValue): void;
}>();

const model = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});

const requiredRule = required($t("fields.requiredField"));

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

// function cleanInput(): void {
// 	// Remove empty tasks
// 	model.value.tasks = model.value.tasks.filter((task: Task) => task.desc.trim());
// }
</script>

<style scoped>
.border {
	border: 1px solid black;
}
</style>
