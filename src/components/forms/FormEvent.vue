<template>
	<v-dialog v-model="showDialog" persistent max-width="600px">
		<v-form v-model="valid" ref="form">
			<v-card>
				<v-card-title>
					<span class="text-h5" v-if="edit">Modifier un événement</span>
					<span class="text-h5" v-else>Ajouter un événement</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-textarea
							outlined
							label="Description*"
							hint="Langage Markdown supporté"
							:rules="requiredRule"
							v-model="model.desc"
						></v-textarea>
						<v-row>
							<v-col cols="12" sm="12" md="6">
								<v-autocomplete
									chips
									label="Type d'événement*"
									v-model="model.type"
									:rules="requiredRule"
									:items="eventTypes"
								>
									<template v-slot:selection="data">
										<v-chip>
											<v-icon left>{{ icons[data.item.value] }}</v-icon>
											{{ data.item.text }}
										</v-chip>
									</template>
									<template v-slot:item="data">
										<v-icon left>{{ icons[data.item.value] }}</v-icon>
										{{ data.item.text }}
									</template>
								</v-autocomplete>
							</v-col>
							<v-col cols="12" sm="12" md="6">
								<v-text-field
									prefix="Jour"
									label="Date de l'événement"
									type="number"
									min="0"
									v-model="model.day"
									:rules="[requiredRule[0], dayRange[0]]"
								></v-text-field>
							</v-col>
						</v-row>
						<TagChooser v-model="model.tags" :exclude-id="model.id" />
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
import constants from "../../js/constants.js";
import icons from "../../js/icons.js";
import { Event } from "../../js/model.js";

import TagChooser from "../TagChooser.vue";

export default {
	props: {
		value: Boolean, // Default v-model overwrite
		id: Number,
		edit: Boolean,
	},
	components: {
		TagChooser,
	},
	data() {
		return {
			valid: false,
			requiredRule: [(v) => !!v || "Champ requis"],
			dayRange: [
				(v) => {
					v = Number(v);
					return Number.isSafeInteger(v) && v >= 0 || "Jour invalide";
				},
			],
			icons: icons,
			model: this.initModel(),
			eventTypes: [
				{
					value: constants.eventTypes.COMBAT,
					text: "Combat",
				},
				{
					value: constants.eventTypes.ENCOUNTER,
					text: "Rencontre",
				},
				{
					value: constants.eventTypes.DISCOVERY,
					text: "Découverte",
				},
				{
					value: constants.eventTypes.TRAVEL,
					text: "Voyage",
				},
				{
					value: constants.eventTypes.OTHER,
					text: "Autre",
				},
			],
		};
	},
	methods: {
		submit() {
			this.$refs.form.validate();

			if (this.valid) {
				// Convert input field value to number
				this.model.day = Number(this.model.day);

				if (this.edit) this.$store.commit("update", this.model);
				else this.$store.commit("add", this.model);

				this.close();
			}
		},
		close() {
			this.showDialog = false;
			this.model = this.initModel();
		},
		initModel() {
			if (this.edit && this.id) {
				let data = this.$store.getters.get(this.id, constants.objectTypes.EVENT);
				// We return a clone of the object to avoid modifying directly the store
				// Helpful when the user cancels their changes because we don't have to rollback
				if (data) return new Event(data);
			}
			// If the user creates a new Event, we set the current day as default
			return new Event({ day: this.$store.state.days });
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
		 * This is allows to use a unique dialog for all event cards edits.
		 * The parent only have to pass the id of the event to edit. When that id changes, the form gets the relevant data to set the model.
		 */
		id: function() {
			this.model = this.initModel();
		},
	},
	mounted() {
		// console.log(5, this.dayRange[0](5));
		// console.log(-5, this.dayRange[0](-5));
		// console.log(0, this.dayRange[0](0));
	},
};
</script>
