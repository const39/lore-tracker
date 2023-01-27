<template>
	<v-dialog v-model="showDialog" persistent max-width="375">
		<v-form ref="form">
			<v-card>
				<v-card-title class="text-h5"> Ajouter un dossier </v-card-title>
				<v-card-text class="d-flex align-center text-body-2 text--primary">
					<v-menu offset-x>
						<template v-slot:activator="{ on, attrs }">
							<v-hover>
								<template #default="{hover}">
									<v-btn v-bind="attrs" v-on="on" class="mr-1" icon x-large>
										<v-icon x-large :color="model.color"> {{ folderIcon }} </v-icon>
										<v-fade-transition>
											<v-overlay v-if="hover" absolute opacity="0.2">
												<v-icon small>mdi-eyedropper-variant</v-icon>
											</v-overlay>
										</v-fade-transition>
									</v-btn>
								</template>
							</v-hover>
						</template>
						<v-color-picker v-model="model.color" :rules="rules.color"></v-color-picker>
					</v-menu>
					<v-text-field
						:label="$t('fields.name') + '*'"
						:rules="rules.name"
						v-model="model.name"
					></v-text-field>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn text color="primary" @click="close"> {{ $t("actions.close") }} </v-btn>
					<v-btn text class="text--primary" @click="submit"> {{ $t("actions.save") }} </v-btn>
				</v-card-actions>
			</v-card>
		</v-form>
	</v-dialog>
</template>

<script lang="ts">
import { Folder, Icon } from "@/js/types";
import utilities from "@/js/utilities";
import validationRules from "@/js/validationRules";

import vuetifyColors from "vuetify/lib/util/colors";

import Vue from "vue";

// Provide form $ref type to TypeScript
type VForm = Vue & { validate: () => boolean };

export default Vue.extend({
	props: {
		value: Boolean, // Default v-model overwrite
		parentPath: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			rules: {
				color: [validationRules.required(this.$t("fields.requiredField")), validationRules.hex("")],
				name: [
					validationRules.required(this.$t("fields.requiredField")),
					validationRules.counter("", 25),
					(this as any).checkNameDoesNotExist,
				],
			},
			model: (this as any).initModel(), // HACK: Type 'this' as any to avoid TS not finding initModel in the current this value
		};
	},
	methods: {
		getRandomColor(): string {
			// ! baseColors cannot be cached as a computed property because initModel() is called at component init
			const baseColors = Object.values(vuetifyColors).map((color) => color.base ?? "#ffffff");
			const idx = Math.floor(Math.random() * baseColors.length);
			return baseColors[idx];
		},
		checkNameDoesNotExist(name: string): boolean | string {
			return !this.$store.getters.doesFolderExist(name) || this.$t("fields.nameAlreadyUsed");
		},
		initModel(): Folder {
			return {
				id: utilities.uid(),
				name: "",
				color: this.getRandomColor(),
			};
		},
		close(): void {
			this.model = this.initModel();
			this.showDialog = false;
		},
		submit(): void {
			if ((this.$refs.form as VForm).validate()) {
				this.$store.dispatch("commitAndSave", {
					commit: "addFolder",
					payload: { pathToParent: this.parentPath, folder: this.model },
				});
				this.close();
			}
		},
	},
	computed: {
		folderIcon() {
			return Icon.folder;
		},
		/**
		 * Overwrite default v-model to bind this component's v-model attribute to the v-dialog one.
		 * This allows to use a custom component as an external activator for the v-dialog.
		 * @see https://vuejs.org/v2/guide/components-custom-events.html#Customizing-Component-v-model
		 */
		showDialog: {
			get(): boolean {
				return this.value;
			},
			set(value: boolean): void {
				this.$emit("input", value);
			},
		},
	},
});
</script>

<style></style>
