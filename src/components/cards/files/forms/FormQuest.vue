<template>
	<v-text-field
		v-model="model.title"
		:label="$t('pages.loreBook.fields.labels.title') + '*'"
		:rules="[requiredRule]"
	/>
	<v-textarea
		v-model="model.desc"
		:label="$t('pages.loreBook.fields.labels.desc')"
		:hint="$t('pages.loreBook.fields.labels.mdSupport')"
		variant="outlined"
		auto-grow
	/>
	<ListPanel
		:title="$t('pages.loreBook.fields.labels.tasks')"
		:placeholder="$t('pages.loreBook.fields.labels.noTask')"
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
					{{
						task.isCompleted
							? $t("pages.loreBook.fields.labels.completed")
							: $t("pages.loreBook.fields.labels.ongoing")
					}}
				</v-tooltip>
			</template>
		</v-text-field>
	</ListPanel>
	<TagListPanel v-model="model.tags" :exclude-id="model.id" />
</template>

<script lang="ts" setup>
import TagListPanel from "@/components/cards/tags/TagListPanel.vue";
import ListPanel from "@/components/common/ListPanel.vue";
import { Quest, Task } from "@/core/models";
import { t as $t } from "@/core/translation";
import { Icon } from "@/core/utils/icons";
import { required } from "@/core/validationRules";

const model = defineModel<Quest>({ required: true }); // v-model

const requiredRule = required($t("pages.loreBook.fields.errors.requiredField"));

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
</script>

<style scoped>
.border {
	border: 1px solid black;
}
</style>
