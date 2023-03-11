<template>
	<v-form v-model="valid" ref="form">
		<!-- Show title if "Add" form version -->
		<v-card-title v-if="props.edit === undefined" class="justify-center">
			<v-icon>{{ categoryIcon }}</v-icon>
			<span class="mx-2">{{ $t("dialogs.addFaction") }}</span>
		</v-card-title>
		<v-card-text>
			<v-container>
				<v-text-field
					:label="$t('fields.name') + '*'"
					:rules="requiredRule"
					v-model="model.name"
				></v-text-field>
				<v-textarea
					outlined
					auto-grow
					:label="$t('fields.desc')"
					:hint="$t('fields.mdSupport')"
					v-model="model.desc"
				></v-textarea>
				<TagListPanel v-model="model.tags" :exclude-id="model.id" />
			</v-container>
			<small>{{ "*" + $t("fields.requiredField") }}</small>
		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn text @click="close">{{ $t("actions.close") }}</v-btn>
			<v-btn color="primary" text :disabled="!valid" @click="submit">{{ $t("actions.save") }}</v-btn>
		</v-card-actions>
	</v-form>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { CardCategory, Faction } from "@/js/types";
import utilities from "@/js/utilities";
import { useForm, type FormProps } from "@/mixins/form";
import { ref } from "vue";
// HACK: Force TS to ignore typing of VForm because not type declaration can be found
//@ts-ignore
import type { VForm } from "vuetify/lib/components";

const form = ref<VForm | null>(null);

function factory(): Faction {
	return {
		_category: CardCategory.Faction,
		id: utilities.uid(),
		desc: "",
		tags: [],
		name: "",
	};
}

const { props, valid, model, requiredRule, categoryIcon, submit, close } = useForm<Faction>(factory, form);
</script>
