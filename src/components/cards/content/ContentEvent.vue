<template>
	<!-- Surrounding <div> necessary to avoid "bouncing" effect when transitioning with Form component -->
	<div>
		<v-card-text class="pa-3">
			<v-row class="d-flex align-center">
				<v-col class="flex-grow-0 flex-shrink-1 text-center">
					<v-tooltip location="top">
						<template v-slot:activator="{ props }">
							<v-icon size="large" v-bind="props">{{ getIcon(itemData) }}</v-icon>
						</template>
						{{ $t(`eventTypes.${itemData.type}`) }}
					</v-tooltip>
					<v-chip label size="x-small" variant="text">{{ $t("status.day") + itemData.day }}</v-chip>
				</v-col>
				<v-col class="flex-grow-1 flex-shrink-0">
					<MarkdownView :text="itemData.desc" />
					<TagList v-model="itemData.tags" />
				</v-col>
			</v-row>
		</v-card-text>
	</div>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { Event } from "@/js/types";
import utilities from "@/js/utilities";
import MarkdownView from "../../MarkdownView.vue";
import TagList from "../tags/TagList.vue";

defineProps<{
	itemData: Event;
}>();

const getIcon = utilities.getIcon;
</script>
