<template>
	<div v-if="breadcrumbs.length" class="d-flex align-center">
		<v-icon icon="mdi-arrow-left" @click="goBack" />
		<v-breadcrumbs :items="breadcrumbs">
			<template #divider>
				<v-icon icon="mdi-chevron-right" />
			</template>
		</v-breadcrumbs>
	</div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { CardFolder } from "@/core/model/cards";
import { Path } from "@/core/model/fileTree";
import { t as $t } from "@/core/translation";

const props = defineProps<{ folder: CardFolder }>();

interface BreadcrumbItem {
	// Item text to display
	text: string;
	// vue-router link for this item
	to: {
		params: {
			folderURI: string | string[];
		};
	};
	// whether this item is clickable or not
	disabled?: boolean;
	// triggers exact navigation to the associated link
	exact: true;
}

const router = useRouter();

function goBack() {
	router.back();
}

const breadcrumbs = computed(() => {
	if (props.folder.path.isRoot()) return [];

	const path = props.folder.path;
	let aggregatedPath = new Path();
	const root: BreadcrumbItem = {
		text: $t("pages.loreBook"),
		to: {
			params: {
				folderURI: [...aggregatedPath.rawSegments],
			},
		},
		disabled: false,
		exact: true,
	};

	const nextItems: BreadcrumbItem[] = path.pathSegments.map((segment, idx) => {
		aggregatedPath = new Path(aggregatedPath, segment);
		return {
			text: segment.getEnd().toString({ leadingSlash: false }),
			to: {
				params: { folderURI: [...aggregatedPath.rawSegments] },
			},
			disabled: idx === path.length - 1,
			exact: true,
		};
	});

	return [root, ...nextItems];
});
</script>
