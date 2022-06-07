<template>
	<v-form v-model="valid" ref="form">
		<!-- Show title if "Add" form version -->
		<v-card-title v-if="edit === undefined">
			<span class="text-h5">{{ $t("dialogs.addObjective") }}</span>
		</v-card-title>
		<v-card-text>
			<v-container>
				<v-textarea
					outlined
					:label="$t('fields.desc')"
					:hint="$t('fields.mdSupport')"
					:rules="requiredRule"
					v-model="model.desc"
				></v-textarea>
				<TagChooser v-model="model.tags" :exclude-id="model.id" />
				<div class="d-flex justify-center">
					<v-radio-group v-model="model.isCompleted" row mandatory>
						<v-radio :label="$t('fields.ongoing')" :value="false"></v-radio>
						<v-radio :label="$t('fields.completed')" :value="true"></v-radio>
					</v-radio-group>
				</div>
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
