<template>
	<v-card class="mb-4">
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
			<p class="text-subtitle-2 text--primary">{{ race }} - {{ classes }} ({{ role }})</p>
			<p class="text--primary">{{ desc }}</p>
		</v-card-text>
	</v-card>
</template>

<script>
import icons from "../../js/icons.js";

export default {
	name: "CharacterCard",
	props: {
		id: Number,
		order: Number,
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
		};
	},
};
</script>

<style></style>
