<template>
	<v-form v-model="isValid" ref="form" validate-on="input">
		<component v-model="model" :is="formComponent" :variant="edit === undefined ? 'add' : 'edit'" />
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn variant="text" @click="close">{{ $t("actions.close") }}</v-btn>
			<v-btn color="primary" variant="text" :disabled="!isValid" @click="submit">
				{{ $t("actions.save") }}
			</v-btn>
		</v-card-actions>
		{{ "valid" + isValid }}
	</v-form>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { CardCategory, CardTypes, EventType, ID } from "@/js/types";
import utilities from "@/js/utilities";
import { useStore } from "@/store";
import { computed } from "vue";
import { watch } from "vue";
import { defineAsyncComponent } from "vue";
import { ref } from "vue";
import { VForm } from "vuetify/components";

const props = defineProps<{
	edit?: ID; // [Optional] leave undefined to use the "Add" form instead of "Edit" form
	category: CardCategory;
}>();

const emit = defineEmits<{
	(e: "done"): void;
}>();

const store = useStore();

const form = ref<VForm | undefined>();
const isValid = ref(false);
const model = ref<CardTypes>(initModel());

// Force trigger validation on any change in model properties because Vuetify does not do it by itself for some reason
watch(model, () => form.value?.validate(), { deep: true });

const formComponent = computed(() => {
	const componentName = "Form" + utilities.capitalize(props.category);
	return defineAsyncComponent({
		loader: () => import(`./${componentName}.vue`),
	});
});

function initModel(): CardTypes {
	if (typeof props.edit !== "undefined") {
		const data = store.getByIdInCategory(props.edit, props.category);
		// We return a clone of the object to avoid modifying directly the store
		// Helpful when the user cancels their changes because we don't have to rollback
		if (data) return utilities.deepCopy(data) as CardTypes;
	}
	return modelFactory();
}

function close() {
	reset();
	emit("done");
}

async function submit() {
	if (await form.value?.validate()) {
		// Update or add card based on form type
		if (typeof props.edit !== "undefined") store.commitAndSave({ commit: "updateCard", payload: model.value });
		else store.commitAndSave({ commit: "addCard", payload: model.value });
	}
	close();
}

function reset() {
	model.value = initModel();
}

function modelFactory(): CardTypes {
	switch (props.category) {
		case CardCategory.Quest:
			return {
				_category: CardCategory.Quest,
				id: utilities.uid(),
				tags: [],
				title: "",
				tasks: [],
			};
		case CardCategory.Event:
			return {
				_category: CardCategory.Event,
				id: utilities.uid(),
				desc: "",
				tags: [],
				type: EventType.OTHER,
				day: store.days,
			};
		case CardCategory.Location:
			return {
				_category: CardCategory.Location,
				id: utilities.uid(),
				desc: "",
				tags: [],
				name: "",
			};
		case CardCategory.Character:
			return {
				_category: CardCategory.Character,
				id: utilities.uid(),
				desc: "",
				tags: [],
				name: "",
				race: "",
				classes: "",
				role: "",
				isAlive: true,
				isNPC: true,
			};
		case CardCategory.Faction:
			return {
				_category: CardCategory.Faction,
				id: utilities.uid(),
				desc: "",
				tags: [],
				name: "",
			};
		case CardCategory.Note:
			return {
				_category: CardCategory.Note,
				id: utilities.uid(),
				desc: "",
				tags: [],
				title: "",
			};
	}
}
</script>

<style scoped></style>
