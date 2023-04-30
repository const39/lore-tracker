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
	text: string;
	to?: {
		params: object;
	};
	disabled?: boolean;
	exact: true;
}

const router = useRouter();

function goBack() {
	router.back();
}

const breadcrumbs = computed(() => {
	if (props.folder.path.isRoot()) return [];

	const path = props.folder.path;
	const root: BreadcrumbItem = {
		text: $t("pages.loreBook"),
		to: {
			params: {
				folderURI: new Path(),
			},
		},
		disabled: false,
		exact: true,
	};

	const nextItems: BreadcrumbItem[] = path.pathSegments.map((segment, idx) => {
		return {
			text: segment.getEnd().toString({ leadingSlash: false }),
			to: {
				params: { folderURI: segment.getHead() },
			},
			disabled: idx === path.length - 1,
			exact: true,
		};
	});

	return [root, ...nextItems];
});
</script>
