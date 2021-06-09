<template>
	<v-dialog v-model="showDialog" max-width="600px">
		<v-form v-model="valid" ref="form">
			<v-card>
				<v-card-title>
					<span class="text-h5">Ajouter un événement</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-textarea
							outlined
							label="Description*"
							:rules="requiredRule"
							v-model="eventModel.desc"
						></v-textarea>
						<v-row>
							<v-col cols="12" sm="6">
								<v-autocomplete
									chips
									label="Localité"
									v-model="eventModel.locationId"
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
								<v-autocomplete
									chips
									label="Type d'événement*"
									v-model="eventModel.type"
									:rules="requiredRule"
									:items="eventTypes"
								>
									<template v-slot:selection="data">
										<v-chip>
											<v-icon left>{{ icons.whichEventIcon(data.item.id) }}</v-icon>
											{{ data.item.text }}
										</v-chip>
									</template>
									<template v-slot:item="data">
										<v-icon left>{{ icons.whichEventIcon(data.item.id) }}</v-icon>
										{{ data.item.text }}
									</template>
								</v-autocomplete>
							</v-col>
						</v-row>
						<v-autocomplete
							chips
							deletable-chips
							multiple
							label="Personnages impliqués"
							v-model="eventModel.charactersIds"
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
	},
	data() {
		return {
			valid: false,
			requiredRule: [(v) => !!v || "Champ requis"],
			icons: icons,
			eventModel: this.initModel(),
			locations: storage.data.locations,
			characters: storage.data.characters,
			eventTypes: [
				{
					id: storage.eventTypes[0],
					text: "Combat",
				},
				{
					id: storage.eventTypes[1],
					text: "Rencontre",
				},
				{
					id: storage.eventTypes[2],
					text: "Découverte",
				},
				{
					id: storage.eventTypes[3],
					text: "Voyage",
				},
				{
					id: storage.eventTypes[4],
					text: "Autre",
				},
			],
		};
	},
	methods: {
		submit() {
			this.$refs.form.validate();
			if (this.valid) {
				this.eventModel.id = storage.uid();
				storage.data.events.push(this.eventModel);
				storage.persist();
				this.showDialog = false;
			}
		},
		initModel() {
			return {
				desc: "",
				locationId: undefined,
				charactersIds: [],
				type: "",
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
			if (!newVal) this.eventModel = this.initModel();
		},
	},
};
</script>

<style scoped>
.custom-border {
	border-style: dashed;
}
</style>
