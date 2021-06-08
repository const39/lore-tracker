<template>
	<v-dialog v-model="showDialog" max-width="600px">
		<template v-slot:activator="{ on, attrs }">
			<v-hover v-slot="{ hover }">
				<v-card outlined class="my-1 custom-border" :class="{ 'grey lighten-3': hover }">
					<v-card-text class="text-center" icon v-bind="attrs" v-on="on">
						<v-icon>mdi-plus</v-icon>
					</v-card-text>
				</v-card>
			</v-hover>
		</template>
		<template v-slot:default>
			<v-form v-model="valid" ref="form">
				<v-card>
					<v-card-title>
						<span class="text-h5">Ajouter une localité</span>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-textarea
								outlined
								label="Description"
								:rules="requiredRule"
								v-model="objectiveModel.desc"
							></v-textarea>
							<v-autocomplete
								chips
								label="Localité"
								v-model="objectiveModel.locationId"
								:rules="requiredRule"
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
							<v-autocomplete
								chips
								deletable-chips
								multiple
								label="Personnages impliqués"
								v-model="objectiveModel.charactersIds"
								:rules="requiredRule"
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
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn text @click="showDialog = false">Fermer</v-btn>
						<v-btn color="primary" text :disabled="!valid" @click="submit">Enregistrer</v-btn>
					</v-card-actions>
				</v-card>
			</v-form>
		</template>
	</v-dialog>
</template>

<script>
import storage from "../../js/storage.js";
import icons from "../../js/icons.js";

export default {
	data() {
		return {
			showDialog: false,
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
				storage.addObjective(this.objectiveModel);
				this.showDialog = false;
			}
		},
		initModel() {
			return {
				desc: "",
				locationId: undefined,
				charactersIds: [],
			};
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
