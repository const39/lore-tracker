<template>
	<v-dialog v-model="showDialog" max-width="850px">
		<v-card>
			<v-card-title>Raccourcis clavier</v-card-title>
			<v-card-text>
				<v-row class="d-flex">
					<v-col cols="12" md="6">
						<HotkeyList title="Pages" :hotkeys="hotkeysDisplay.pages" />
						<HotkeyList title="Divers" :hotkeys="hotkeysDisplay.misc" />
					</v-col>
					<v-col cols="12" md="6">
						<HotkeyList title="Contenu" :hotkeys="hotkeysDisplay.content" />
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn text color="primary" @click="showDialog = false">Fermer</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import HotkeyList from "./HotkeyList.vue";

export default {
	components: {
		HotkeyList,
	},
    props: {
		value: Boolean, // Default v-model overwrite
    },
	data() {
		return {
			hotkeysDisplay: {
				pages: [
					{
						text: "Naviguer vers le Lore Tracker",
						command: "F1",
					},
					{
						text: "Naviguer vers la Frise des événements",
						command: "F2",
					},
				],
				content: [
					{
						text:
							"Afficher l'onglet/la colonne Objectifs",
						command: "Alt+1",
					},
					{
						text:
							"Afficher l'onglet/la colonne Événement",
						command: "Alt+2",
					},
					{
						text:
							"Afficher l'onglet/la colonne Localités",
						command: "Alt+3",
					},
					{
						text:
							"Afficher l'onglet/la colonne Personnages",
						command: "Alt+4",
					},
					{
						text:
							"Afficher l'onglet/la colonne Notes",
						command: "Alt+5",
					},
				],
				misc: [
					{
						text: "Ouvrir/fermer la fenêtre de recherche",
						command: "Ctrl+K",
					},
					{
						text: "Ouvrir/fermer le menu des options",
						command: "ESC",
					},
				],
			},
		};
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
};
</script>
