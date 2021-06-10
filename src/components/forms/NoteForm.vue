<template>
	<v-dialog v-model="showDialog" max-width="600px">
		<v-form v-model="valid" ref="form">
			<v-card>
				<v-card-title>
					<span class="text-h5" v-if="edit">Modifier une note</span>
					<span class="text-h5" v-else>Ajouter une note</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-text-field label="Titre" v-model="noteModel.title"></v-text-field>
						<v-textarea
							outlined
							label="Description*"
							:rules="requiredRule"
							v-model="noteModel.desc"
						></v-textarea>
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
import storage from "../../js/storage.js";

export default {
	props: {
		value: Boolean, // Default v-model overwrite
		id: Number,
		edit: Boolean
	},
	data() {
		return {
			valid: false,
			requiredRule: [(v) => !!v || "Champ requis"],
			noteModel: this.initModel(),
		};
	},
	methods: {
		submit() {
			this.$refs.form.validate();

			if (this.valid) {

				// In edit mode
				if(this.edit) {
					
					let index = storage.data.notes.findIndex(entry => entry.id === this.id);

					// We use this.$set() to replace the object at index with our new model while allowing Vue to still track changes to that object
					// @see https://vuejs.org/v2/guide/reactivity.html#For-Arrays
					if(index != -1) this.$set(storage.data.notes, index, this.noteModel);
					else console.error("Could not save the edit.");

				// In create mode
				} else {
					this.noteModel.id = storage.uid();
					storage.data.notes.push(this.noteModel);
				}

				storage.persist();
				this.showDialog = false;
			}
		},
		initModel() {
			if (this.edit && this.id) {
				let data = storage.data.notes.find((entry) => entry.id === this.id);

				// We return a clone of the object to avoid modifying directly the store
				// Helpful when the user cancels their changes because we don't have to rollback
				if (data) return storage.clone(data);
			}
			return {
				title: "",
				desc: "",
			};
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
			if (!newVal) this.noteModel = this.initModel();
		},
	},
};
</script>

<style></style>
