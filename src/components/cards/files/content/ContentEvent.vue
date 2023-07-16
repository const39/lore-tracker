<template>
	<!-- Surrounding <div> necessary to avoid "bouncing" effect when transitioning with Form component -->
	<div>
		<v-card-text class="pa-3">
			<v-row class="d-flex align-center">
				<v-col class="flex-grow-0 flex-shrink-1 text-center">
					<v-tooltip location="top">
						<template #activator="{ props }">
							<v-icon v-bind="props" :icon="getIcon(itemData)" size="large" />
						</template>
						{{ $t(`eventTypes.${itemData.type}`) }}
					</v-tooltip>
					<v-chip size="x-small" variant="text" label>
						{{ $t("status.day") + itemData.day }}
					</v-chip>
				</v-col>
				<v-col class="flex-grow-1 flex-shrink-0">
					<MarkdownView :text="itemData.desc" />
					<!-- eslint-disable-next-line vue/no-mutating-props - Editable is false so tags is not mutated -->
					<TagList v-model="itemData.tags" :editable="false" />
				</v-col>
			</v-row>
		</v-card-text>
	</div>
</template>

<script lang="ts" setup>
import TagList from "@/components/cards/tags/TagList.vue";
import MarkdownView from "@/components/common/MarkdownView.vue";
import { getIcon } from "@/core/utils/icons";
import { Event } from "@/core/model/cards";
import { t as $t } from "@/core/translation";

defineProps<{
	itemData: Event;
}>();
</script>
