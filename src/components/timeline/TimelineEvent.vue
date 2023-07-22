<template>
	<v-timeline-item
		:class="{ clickable: !node.isHeader }"
		:icon="node.icon"
		:dot-color="node.color"
		:size="node.isHeader ? 'small' : undefined"
		:fill-dot="!node.isHeader"
		icon-color="white"
		@click="goToCard"
	>
		<div :class="{ 'font-weight-medium': node.isHeader }">
			<MarkdownView :text="node.text" />
		</div>
	</v-timeline-item>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { Category, Event, EventType } from "@/core/models";
import MarkdownView from "../common/MarkdownView.vue";

interface Node {
	isHeader: boolean;
	text: string;
	icon: string;
	color: string;
}

// ! Vue throws a type-check warning at runtime because it cannot crawl imported Event type
// @see https://vuejs.org/guide/typescript/composition-api.html#syntax-limitations
type ItemType = Event | string;
const props = defineProps<{
	item: ItemType;
}>();

const router = useRouter();

/**
 * Return a custom object with the node's data, depending on the item prop type.
 */
const node = computed(() => {
	const info = {} as Node;

	/**
	 * If the item prop is an Event, return the relevant Event data.
	 * Otherwise, return the prop string in a 'header' field.
	 */
	if (typeof props.item === "string") {
		info.isHeader = true;
		info.text = props.item;
		info.icon = "";
		info.color = "on-surface";
	} else if (props.item.category === Category.Event) {
		info.text = props.item.getText();
		info.icon = props.item.getIcon();

		switch (props.item.type) {
			case EventType.COMBAT:
				info.color = "deep-orange-darken-1";
				break;
			case EventType.ENCOUNTER:
				info.color = "purple-darken-1";
				break;
			case EventType.DISCOVERY:
				info.color = "green-lighten-1";
				break;
			case EventType.TRAVEL:
				info.color = "indigo";
				break;
			default:
				info.color = "grey-darken-2";
				break;
		}
	}

	return info;
});

/**
 * Navigate to the card referenced by the current event.
 */
function goToCard() {
	if (typeof props.item !== "string") {
		if (props.item.folderId) {
			// Navigate to the event's folder, passing along the event ID in the URL's hash
			router.push({
				name: "LoreBookTab",
				params: {
					category: props.item.category,
					folderId: props.item.folderId,
				},
				hash: `#${props.item.id}-card`,
			});
		}
	}
}
</script>
<style>
/* Set zoom on hover animation on the compiled Vuetify class of the dot */
.v-timeline-divider__dot:hover {
	animation: zoom-on-hover 0.1s ease-in 1;
	transform: scale(1.25);
}

@keyframes zoom-on-hover {
	0% {
		transform: scale(1);
	}
	100% {
		transform: scale(1.25);
	}
}
</style>
