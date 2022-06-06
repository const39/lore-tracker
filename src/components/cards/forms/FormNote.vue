<template>
	<v-form v-model="valid" ref="form">
		<!-- Show title if "Add" form version -->
		<v-card-title v-if="edit === undefined">
			<span class="text-h5">{{ $t("dialogs.addNote") }}</span>
		</v-card-title>
		<v-card-text>
			<v-container>
				<v-text-field :label="$t('fields.title')" v-model="model.title"></v-text-field>
				<v-textarea
					outlined
					:label="$t('fields.desc')"
					:hint="$t('fields.mdSupport')"
					:rules="requiredRule"
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
import Vue from 'vue';
import utilities from '@/js/utilities';
import { CardCategory } from "@/js/types";
import { Note } from "@/js/types";

import TagChooser from "../tags/TagChooser.vue";

export default Vue.extend({
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
			requiredRule: [(v: string) => !!v || this.$t("fields.requiredField")],
			model: this.initModel(),
		};
	},
	methods: {
		submit(): void {
			this.$refs.form.validate();

			if (this.valid) {
				if (this.edit) this.$store.commit("update", this.model);
				else this.$store.commit("add", this.model);

				this.close();
			}
		},
		close(): void {
			this.model = this.initModel();
			// Fire a custom event to the parent component. The parent can decide to catch this event to react to the user action.
			this.$emit("close");
		},
		initModel(): Note {
			if (this.edit !== undefined) {
				let data = this.$store.getters.get(this.edit, CardCategory.Note);
				// We return a clone of the object to avoid modifying directly the store
				// Helpful when the user cancels their changes because we don't have to rollback
				if (data) return { ...data };
			}
			return {
				_category: CardCategory.Note,
				id: utilities.uid(),
				desc: "",
				tags: [],
				title: ""
			};
		},
	},
	watch: {
		/**
		 * Observe the edit prop. When the prop changes, we update the model.
		 * This is allows to use a unique dialog for all note cards edits.
		 * The parent only have to pass the id of the note to edit. When that id changes, the form gets the relevant data to set the model.
		 */
		edit: function(): void {
			this.model = this.initModel();
		},
	},
});
</script>

<style></style>
