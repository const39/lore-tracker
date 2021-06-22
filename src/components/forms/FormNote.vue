<template>
	<v-dialog v-model="showDialog" persistent max-width="600px">
		<v-form v-model="valid" ref="form">
			<v-card>
				<v-card-title>
					<span class="text-h5" v-if="edit">Modifier une note</span>
					<span class="text-h5" v-else>Ajouter une note</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-text-field label="Titre" v-model="model.title"></v-text-field>
						<v-textarea
							outlined
							label="Description*"
							hint="Langage Markdown supporté"
							:rules="requiredRule"
							v-model="model.desc"
						></v-textarea>
						<TagChooser v-model="model.tags" :exclude-id="model.id"/>
					</v-container>
					<small>*champ requis</small>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn text @click="close">Fermer</v-btn>
					<v-btn color="primary" text :disabled="!valid" @click="submit">Enregistrer</v-btn>
				</v-card-actions>
			</v-card>
		</v-form>
	</v-dialog>
</template>

<script>
import { Note } from '../../js/model.js';

import TagChooser from "../TagChooser.vue";

export default {
	props: {
		value: Boolean, // Default v-model overwrite
		id: Number,
		edit: Boolean
	},
	components: {
		TagChooser
	},
	data() {
		return {
			valid: false,
			requiredRule: [(v) => !!v || "Champ requis"],
			model: this.initModel(),
		};
	},
	methods: {
		submit() {
			this.$refs.form.validate();

			if (this.valid) {

				if(this.edit) this.$store.commit('update', this.model);
				else this.$store.commit('add', this.model);

				this.close();
			}
		},
		close() {
			this.showDialog = false;
			this.model = this.initModel();
		},
		initModel() {
			if (this.edit && this.id) {
				let data = this.$store.getters.findById('note', this.id);
				// We return a clone of the object to avoid modifying directly the store
				// Helpful when the user cancels their changes because we don't have to rollback
				if (data) return new Note(data);
			}
			return new Note();
		},
	},
	computed: {
		/**
		 * Overwrite default v-model to bind the ObjectiveForm v-model attribute to the v-dialog one.
		 * This allows to use a custom component as an external activator for the v-dialog.
		 * @see https://vuejs.org/v2/guide/components-custom-events.html#Customizing-Component-v-model
		 */
		showDialog: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit("input", value);
			},
		},
	},
	watch: {
		/**
		 * Observe the id prop. When the prop changes, we update the model.
		 * This is allows to use a unique dialog for all note cards edits.
		 * The parent only have to pass the id of the note to edit. When that id changes, the form gets the relevant data to set the model.
		 */
		id: function() {
			this.model = this.initModel();
		}
	},
};
</script>

<style></style>
