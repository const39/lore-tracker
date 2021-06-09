<template>
	<v-dialog v-model="showDialog" max-width="600px">
		<v-form v-model="valid" ref="form">
			<v-card>
				<v-card-title>
					<span class="text-h5">Ajouter une localité</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-text-field
							label="Nom de la localité"
							:rules="requiredRule"
							v-model="locationModel.name"
						></v-text-field>
						<v-textarea outlined label="Description" v-model="locationModel.desc"></v-textarea>
					</v-container>
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
	},
	data() {
		return {
			valid: false,
			requiredRule: [(v) => !!v || "Champ requis"],
			locationModel: this.initModel(),
		};
	},
	methods: {
		submit() {
			this.$refs.form.validate();
			if (this.valid) {
				this.locationModel.id = storage.uid();
				storage.data.locations.push(this.locationModel);
				storage.persist();
				this.showDialog = false;
			}
		},
		initModel() {
			return {
				name: "",
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
			if (!newVal) this.locationModel = this.initModel();
		},
	},
};
</script>

<style></style>
