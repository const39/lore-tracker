<template>
	<v-form ref="form" v-model="isValid" validate-on="input">
		<component
			:is="formComponent"
			v-model="model"
			:variant="edit === undefined ? 'add' : 'edit'"
		/>
		<v-card-actions>
			<v-spacer />
			<v-btn variant="text" @click="close">
				{{ $t("actions.close") }}
			</v-btn>
			<v-btn :disabled="!isValid" color="primary" variant="text" @click="submit">
				{{ $t("actions.save") }}
			</v-btn>
		</v-card-actions>
	</v-form>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref, watch } from "vue";
import { VForm } from "vuetify/components";
import { CardCategory, CardTypes, EventType, ID } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import utilities from "@/core/utilities";
import { useCampaignInfoStore } from "@/store/campaignInfo";
import { useCardsStore } from "@/store/cards";

const props = defineProps<{
	edit?: ID; // [Optional] leave undefined to use the "Add" form instead of "Edit" form
	category: CardCategory;
}>();

const emit = defineEmits<{
	(e: "done"): void;
}>();

const campaignInfoStore = useCampaignInfoStore();
const cardsStore = useCardsStore();

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
		const data = cardsStore.findFileInCurrentFolder(props.edit);
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
		if (typeof props.edit !== "undefined") cardsStore.updateCard(model.value);
		else cardsStore.addCard(model.value);
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
				day: campaignInfoStore.days,
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
