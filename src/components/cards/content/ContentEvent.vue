<template>
	<!-- Surrounding <div> necessary to avoid "bouncing" effect when transitioning with Form component -->
	<div>
		<v-card-text class="pa-3">
			<v-row class="d-flex align-center">
				<v-col class="flex-grow-0 flex-shrink-1 text-center">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-icon large v-on="on" v-bind="attrs">{{ getIcon(itemData) }}</v-icon>
						</template>
						{{ $t(`eventTypes.${itemData.type}`) }}
					</v-tooltip>
					<v-chip label x-small outlined>{{ $t("status.day") + itemData.day }}</v-chip>
				</v-col>
				<v-col class="flex-grow-1 flex-shrink-0">
					<MarkdownView :text="itemData.desc" />
					<TagList v-model="itemData.tags" />
				</v-col>
			</v-row>
		</v-card-text>
	</div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Event } from "@/js/types";

import TagList from "../tags/TagList.vue";
import MarkdownView from "../../MarkdownView.vue";
import utilities from '@/js/utilities';

export default Vue.extend({
	name: "ContentEvent",
	components: {
		TagList,
		MarkdownView,
	},
	props: {
		itemData: {
			type: Object as PropType<Event>,
			required: true,
		},
	},
	methods: {
		getIcon: utilities.getIcon
	}
});
</script>
