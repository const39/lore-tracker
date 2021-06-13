<template>
	<v-card class="mb-4">
		<v-card-actions class="float-right">
			<CardOptions @option-selected="onOptionSelected"></CardOptions>
			<CharacterForm v-model="showEditDialog" edit :id="id"></CharacterForm>
			<ConfirmDialog
				v-model="showDeleteDialog"
				:acceptAction="deleteCharacter"
				:title="`Supprimer ${name} ?`"
				:message="'Voulez-vous vraiment supprimer ce personnage ?'"
			></ConfirmDialog>
		</v-card-actions>
		<v-card-text class="pa-3">
			<p class="text-h6 text--primary">
				{{ name }}
				<v-tooltip top v-if="isNPC">
					<template v-slot:activator="{ on, attrs }">
						<v-icon v-bind="attrs" v-on="on">{{ icons.npc }}</v-icon>
					</template>
					<span>PNJ</span>
				</v-tooltip>
				<v-tooltip top v-else>
					<template v-slot:activator="{ on, attrs }">
						<v-icon v-bind="attrs" v-on="on">{{ icons.player }}</v-icon>
					</template>
					<span>Joueur</span>
				</v-tooltip>
			</p>
			<p class="text-subtitle-2 text--primary">{{ identity }}</p>
			<p class="text--primary">{{ desc }}</p>
		</v-card-text>
	</v-card>
</template>

<script>
import storage from "../../js/storage.js";
import icons from "../../js/icons.js";

import CardOptions from "./CardOptions.vue";
import CharacterForm from "../forms/CharacterForm.vue";
import ConfirmDialog from "../ConfirmDialog.vue";

export default {
	name: "CharacterCard",
	components: {
		CardOptions,
		CharacterForm,
		ConfirmDialog
	},
	props: {
		id: Number,
		name: String,
		race: String,
		classes: String,
		role: String,
		isNPC: Boolean,
		desc: String,
	},
	data() {
		return {
			icons: icons,
			showEditDialog: false,
			showDeleteDialog: false,
		};
	},
	methods: {
		onOptionSelected(value) {
			if (value === "edit") this.showEditDialog = true;
			else if (value === "delete") this.showDeleteDialog = true;
		},
		deleteCharacter() {
			storage.deleteCharacter(this.id);
		},
	},
    computed: {
        identity() {

            let race = this.race || 'Race inconnue';
            let classes = this.classes || 'Classes inconnues';
            let role = this.role || 'Rôle inconnu';

            return `${race} - ${classes} (${role})`;
        }
    }
};
</script>

<style></style>
