<template>
	<v-chip
		:closable="closable"
		:text="truncate(tag.text, 30)"
		:prepend-icon="showIcon ? tag.icon : undefined"
		class="ma-1"
		size="small"
		@click:close="$emit('click:close', $event)"
	/>
</template>

<script lang="ts" setup>
import { Tag } from "@/core/model/cards";
import { truncate } from "@/core/utilities";

defineProps<{
	tag: Tag;
	closable?: boolean;
	showIcon?: boolean;
}>();

defineEmits<{
	(e: "click:close", value: Event): void;
}>();
</script>
