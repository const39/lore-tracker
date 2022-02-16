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

<script>
import constants from "../../../js/constants.js";
import { Objective } from "../../../js/model.js";

import TagChooser from "../../TagChooser.vue";

export default {
	props: {
		value: Boolean, // Default v-model overwrite
		edit: Number,
	},
	components: {
		TagChooser,
	},
	data() {
		return {
			valid: false,
			requiredRule: [(v) => !!v || this.$t("fields.requiredField")],
			model: this.initModel(),
		};
	},
	methods: {
		submit() {
			this.$refs.form.validate();

			if (this.valid) {
				if (this.edit) this.$store.commit("update", this.model);
				else this.$store.commit("add", this.model);

				this.close();
			}
		},
		close() {
			this.model = this.initModel();
			// Fire a custom event to the parent component. The parent can decide to catch this event to react to the user action.
			this.$emit("close");
		},
		initModel() {
			if (this.edit !== undefined) {
				let data = this.$store.getters.get(this.edit, constants.objectTypes.OBJECTIVE);
				// We return a clone of the object to avoid modifying directly the store
				// Helpful when the user cancels their changes because we don't have to rollback
				if (data) return new Objective(data);
			}
			return new Objective();
		},
	},
	watch: {
		/**
		 * Observe the edit prop. When the prop changes, we update the model.
		 * This is allows to use a unique dialog for all objective cards edits.
		 * The parent only have to pass the id of the objective to edit. When that id changes, the form gets the relevant data to set the model.
		 */
		edit: function() {
			this.model = this.initModel();
		},
	},
};
</script>
