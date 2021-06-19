<template>
	<v-dialog v-model="showDialog" max-width="600px">
		<v-form v-model="valid" ref="form">
			<v-card>
				<v-card-title>
					<span class="text-h5" v-if="edit">Modifier un personnage</span>
					<span class="text-h5" v-else>Ajouter un personnage</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-row>
							<v-col cols="12" sm="6" md="4">
								<v-text-field
									label="Nom*"
									:rules="requiredRule"
									v-model="model.name"
								></v-text-field>
							</v-col>
							<v-col cols="12" sm="6" md="4">
								<v-text-field label="Race" v-model="model.race"></v-text-field>
							</v-col>
							<v-col cols="12" sm="6" md="4">
								<v-text-field label="Classes" v-model="model.classes"></v-text-field>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="12" sm="6">
								<v-text-field label="Rôle" v-model="model.role"></v-text-field>
							</v-col>
							<v-col cols="12" sm="6">
								<v-radio-group v-model="model.isNPC" row mandatory>
									<v-radio label="Joueur" :value="false"></v-radio>
									<v-radio label="Non-joueur" :value="true"></v-radio>
								</v-radio-group>
							</v-col>
						</v-row>
						<v-textarea outlined label="Description" v-model="model.desc"></v-textarea>
						<TagChooser v-model="model.tags" :exclude-id="model.id"/>
					</v-container>
					<small>*champ requis</small>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn text @click="showDialog = false">Fermer</v-btn>
					<v-btn color="primary" text :disabled="!valid" @click="submit">Enregistrer</v-btn>
				</v-card-actions>
			</v-card>
		</v-form>
	</v-dialog>
</template>

<script>
import { Character } from '../../js/model.js';
import storage from "../../js/storage.js";

import TagChooser from "../TagChooser.vue";

export default {
	props: {
		value: Boolean, // Default v-model overwrite
		id: Number,
		edit: Boolean,
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
				
				// In edit mode
				if (this.edit) {
					let index = storage.data.characters.findIndex((entry) => entry.id === this.id);

					// We use this.$set() to replace the object at index with our new model while allowing Vue to still track changes to that object
					// @see https://vuejs.org/v2/guide/reactivity.html#For-Arrays
					if (index != -1) this.$set(storage.data.characters, index, this.model);
					else console.error("Could not save the edit.");

				// In create mode
				} else storage.data.characters.push(this.model);

				storage.persist();
				this.showDialog = false;
			}
		},
		initModel() {
			if (this.edit && this.id) {
				let data = storage.data.characters.find((entry) => entry.id === this.id);

				// We return a clone of the object to avoid modifying directly the store
				// Helpful when the user cancels their changes because we don't have to rollback
				if (data) return new Character(data);
			}
			return new Character();
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
		 * Observe the showDialog variable to reset the model on dialog close, i.e. when the value changes to False.
		 * Using a watcher allows to covers all dialog close cases :
		 * - on submit
		 * - on explicit close (by clicking on the 'Close' button)
		 * - on implicit close (by clicking outside the dialog or pressing Esc)
		 */
		showDialog: function(newVal) {
			if (!newVal) this.model = this.initModel();
		},
		/**
		 * Observe the id prop. When the prop changes, we update the model.
		 * This is allows to use a unique dialog for all character cards edits.
		 * The parent only have to pass the id of the character to edit. When that id changes, the form gets the relevant data to set the model.
		 */
		id: function() {
			this.model = this.initModel();
		}
	},
};
</script>

<style></style>
