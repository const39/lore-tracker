<template>
	<v-form v-model="valid" ref="form">
		<!-- Show title if "Add" form version -->
		<v-card-title v-if="props.edit === undefined" class="justify-center">
			<v-icon>{{ categoryIcon }}</v-icon>
			<span class="mx-2">{{ $t("dialogs.addLocation") }}</span>
		</v-card-title>
		<v-card-text>
			<v-container>
				<v-text-field
					:label="$t('fields.name') + '*'"
					:rules="requiredRule"
					v-model="model.name"
				></v-text-field>
				<v-textarea
					variant="outlined"
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
			<v-btn variant="text" @click="close">{{ $t("actions.close") }}</v-btn>
			<v-btn color="primary" variant="text" :disabled="!valid" @click="submit">{{ $t("actions.save") }}</v-btn>
		</v-card-actions>
	</v-form>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { CardCategory, Location } from "@/js/types";
import utilities from "@/js/utilities";
import { useForm, type FormProps } from "@/mixins/form";
import { ref } from "vue";
import type { VForm } from "vuetify/components";

const form = ref<VForm | undefined>(undefined);

function factory(): Location {
	return {
		_category: CardCategory.Location,
		id: utilities.uid(),
		desc: "",
		tags: [],
		name: "",
	};
}

const { props, valid, model, requiredRule, categoryIcon, submit, close } = useForm<Location>(factory, form);
</script>
