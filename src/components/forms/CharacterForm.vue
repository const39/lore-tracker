<template>
	<v-dialog v-model="showDialog" max-width="600px">
		<v-form v-model="valid" ref="form">
			<v-card>
				<v-card-title>
					<span class="text-h5">Ajouter un personnage</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-row>
							<v-col cols="12" sm="6" md="4">
								<v-text-field
									label="Nom"
									:rules="requiredRule"
									v-model="characterModel.name"
								></v-text-field>
							</v-col>
							<v-col cols="12" sm="6" md="4">
								<v-text-field label="Race" v-model="characterModel.race"></v-text-field>
							</v-col>
							<v-col cols="12" sm="6" md="4">
								<v-text-field label="Classes" v-model="characterModel.classes"></v-text-field>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="12" sm="6">
								<v-text-field label="Rôle" v-model="characterModel.role"></v-text-field>
							</v-col>
							<v-col cols="12" sm="6">
								<v-radio-group v-model="characterModel.isNPC" row mandatory>
									<v-radio label="Joueur" value="player"></v-radio>
									<v-radio label="Non-joueur" value="npc"></v-radio>
								</v-radio-group>
							</v-col>
						</v-row>
						<v-textarea outlined label="Description" v-model="characterModel.desc"></v-textarea>
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
			characterModel: this.initModel(),
		};
	},
	methods: {
		submit() {
			this.$refs.form.validate();
			if (this.valid) {
				this.characterModel.id = storage.uid();
				this.characterModel.isNPC = (this.characterModel.isNPC === "npc");
				storage.data.characters.push(this.characterModel);
				storage.persist();
				this.showDialog = false;
			}
		},
		initModel() {
			return {
				name: "",
				race: "",
				classes: "",
				role: "",
				isNPC: "",
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
			if (!newVal) this.characterModel = this.initModel();
		},
	},
};
</script>

<style></style>
