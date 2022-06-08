<template>
	<v-form v-model="valid" ref="form">
		<!-- Show title if "Add" form version -->
		<v-card-title v-if="edit === undefined" class="justify-center">
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
					outlined
					:label="$t('fields.desc')"
					:hint="$t('fields.mdSupport')"
					v-model="model.desc"
				></v-textarea>
				<TagChooser v-model="model.tags" :exclude-id="model.id" />
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

<script lang="ts">
import Vue from "vue";
import form from "@/mixins/form";

export default Vue.extend({
	mixins: [form],
});
</script>
