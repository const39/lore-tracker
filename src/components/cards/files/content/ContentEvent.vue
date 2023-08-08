<template>
	<v-card-text class="pa-3">
		<v-row class="d-flex">
			<v-col class="flex-grow-0 flex-shrink-1 text-center">
				<div class="py-2">
					<v-tooltip location="top">
						<template #activator="{ props }">
							<v-icon v-bind="props" :icon="itemData.getIcon()" size="large" />
						</template>
						{{ $t(`data.eventTypes.${itemData.type}`) }}
					</v-tooltip>
					<v-chip size="x-small" variant="text" label>
						{{ $t("data.campaign.day") + " " + itemData.day }}
					</v-chip>
				</div>
			</v-col>
			<v-col>
				<MarkdownView :text="itemData.desc" />
				<!-- eslint-disable-next-line vue/no-mutating-props - Editable is false so tags is not mutated -->
				<TagList v-model="itemData.tags" :editable="false" />
			</v-col>
		</v-row>
	</v-card-text>
</template>

<script lang="ts" setup>
import TagList from "@/components/cards/tags/TagList.vue";
import MarkdownView from "@/components/common/MarkdownView.vue";
import { Event } from "@/core/models";
import { t as $t } from "@/core/translation";

defineProps<{
	itemData: Event;
}>();
</script>
