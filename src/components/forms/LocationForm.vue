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
							<v-text-field label="Nom de la localité" :rules="requiredRule" v-model="locationName"></v-text-field>
							<v-textarea outlined label="Description" v-model="locationDesc"></v-textarea>
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

export default {
	data() {
		return {
			showDialog: false,
			valid: false,
            requiredRule: [
                v => !!v || 'Champ requis'
            ],
			locationName: '',
			locationDesc: '',
		};
	},
	methods: {
		submit() {
            this.$refs.form.validate();
            if(this.valid) {

				storage.addLocation(this.locationName, this.locationDesc);

				this.resetModels();
				this.showDialog = false;
			} 

		},
		resetModels() {
			this.locationName = '';
			this.locationDesc = '';
		}
	},
};
</script>

<style scoped>
.custom-border {
	border-style: dashed;
}
</style>
