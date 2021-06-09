<template>
	<v-dialog v-model="showDialog" max-width="600px">
		<v-form v-model="valid" ref="form">
			<v-card>
				<v-card-title>
					<span class="text-h5" v-if="edit"> Modifer un objectif</span>
					<span class="text-h5" v-else> Ajouter un objectif</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-textarea
							outlined
							label="Description*"
							:rules="requiredRule"
							v-model="objectiveModel.desc"
						></v-textarea>
						<v-row>
							<v-col cols="12" sm="6">
								<v-autocomplete
									chips
									label="Localité"
									v-model="objectiveModel.locationId"
									:items="locations"
									item-text="name"
									item-value="id"
								>
									<template v-slot:selection="data">
										<v-chip>
											<v-icon left>{{ icons.location }}</v-icon>
											{{ data.item.name }}
										</v-chip>
									</template>
								</v-autocomplete>
							</v-col>
							<v-col cols="12" sm="6">
								<v-radio-group v-model="objectiveModel.isCompleted" row mandatory>
									<v-radio label="En cours" :value="false"></v-radio>
									<v-radio label="Accompli" :value="true"></v-radio>
								</v-radio-group>
							</v-col>
						</v-row>
						<v-autocomplete
							chips
							deletable-chips
							multiple
							label="Personnages impliqués"
							v-model="objectiveModel.charactersIds"
							:items="characters"
							item-text="name"
							item-value="id"
						>
							<template v-slot:selection="data">
								<v-chip>
									<v-icon left v-if="data.item.isNPC">{{ icons.npc }}</v-icon>
									<v-icon left v-else>{{ icons.player }}</v-icon>
									{{ data.item.name }}
								</v-chip>
							</template>
						</v-autocomplete>
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
import icons from "../../js/icons.js";

export default {
	props: {
		value: Boolean, // Default v-model overwrite
		id: Number,
		edit: Boolean,
	},
	data() {
		return {
			valid: false,
			requiredRule: [(v) => !!v || "Champ requis"],
			icons: icons,
			objectiveModel: this.initModel(),
			locations: storage.data.locations,
			characters: storage.data.characters,
		};
	},
	methods: {
		submit() {
			this.$refs.form.validate();
			if (this.valid) {

				/**
				 * We explicitly modify the store on submit only when adding a new record.
				 * On edit mode, the model already has a reference on the store so modification are live.
				 * @see initModel()  
				 */
				if (!this.edit) {
					this.objectiveModel.id = storage.uid();
					storage.data.objectives.push(this.objectiveModel);
				}

				storage.persist();
				this.showDialog = false;
			}
		},
		initModel() {
			if (this.edit && this.id) {
				let data = storage.data.objectives.find((entry) => entry.id === this.id);
				if (data) return data;
			}
			return {
				desc: "",
				isCompleted: "",
				locationId: undefined,
				charactersIds: [],
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
			if (!newVal) this.objectiveModel = this.initModel();
		},
	},
};
</script>

<style scoped>
.custom-border {
	border-style: dashed;
}
</style>
