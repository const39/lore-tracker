<template>
	<!-- Surrounding <div> necessary to avoid "bouncing" effect when transitioning with Form component -->
	<div>
		<v-card-text class="pa-3">
			<p class="text-h6 text--primary">
				{{ itemData.name }}
				<v-tooltip top v-if="!itemData.isAlive">
					<template v-slot:activator="{ on, attrs }">
						<v-icon v-bind="attrs" v-on="on">mdi-skull</v-icon>
					</template>
					<span>{{ $t("fields.dead") }}</span>
				</v-tooltip>
				<v-chip label x-small> {{ itemData.isNPC ? $t("fields.npc") : $t("fields.player") }} </v-chip>
			</p>
			<p class="text-subtitle-2 text--primary text-truncate">{{ identity }}</p>
			<MarkdownView :text="itemData.desc" />
			<TagList :items="itemData.tags" />
		</v-card-text>
	</div>
</template>

<script>
import { Character } from "../../../js/model.js";

import TagList from "../tags/TagList.vue";
import MarkdownView from "../../MarkdownView.vue";

export default {
	name: "ContentCharacter",
	components: {
		TagList,
		MarkdownView,
	},
	props: {
		itemData: {
			type: Character,
			required: true,
		},
	},
	computed: {
		identity() {
			let race = this.itemData.race || this.$t("fields.unknownRace");
			let classes = this.itemData.classes || this.$t("fields.unknownClass");
			let role = this.itemData.role || this.$t("fields.unknownRole");

			return `${race} - ${classes} (${role})`;
		},
	},
};
</script>
