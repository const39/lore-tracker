<template>
	<v-container>
		<div v-if="breadcrumbs.length" class="d-flex">
			<v-icon icon="mdi-arrow-left" @click="goBack" />
			<v-breadcrumbs :items="breadcrumbs">
				<template #divider>
					<v-icon icon="mdi-chevron-right" />
				</template>
			</v-breadcrumbs>
		</div>
		<div class="my-3">
			<div class="mb-4 py-3 text-h6">
				{{ $t("notepad.types.folder") + "s" }}
			</div>
			<v-row>
				<v-col
					v-for="subfolder in folder.subfolders"
					:key="subfolder.metadata.id"
					cols="12"
					md="3"
				>
					<FolderCard :folder="subfolder" @open-folder="openFolder(subfolder)" />
				</v-col>
			</v-row>
		</div>
		<div class="my-3">
			<div class="mb-4 py-3 text-h6">
				{{ $t("notepad.types.file") + "s" }}
			</div>
			<draggable
				v-model="files"
				:animation="200"
				:disabled="isSortDisabled"
				tag="v-row"
				draggable=".item"
				group="items"
				item-key="id"
				@start="drag = true"
				@end="drag = false"
			>
				<template #header>
					<v-col cols="12" v-bind="cols">
						<CardAdd :category="category" fill-height />
					</v-col>
				</template>
				<template #item="{ element }">
					<v-col class="item" cols="12" v-bind="cols">
						<CardContainer
							:class="{ draggable: !isSortDisabled }"
							:item-data="element"
						/>
					</v-col>
				</template>
			</draggable>
		</div>
	</v-container>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import draggable from "vuedraggable";
import CardAdd from "@/components/cards/CardAdd.vue";
import CardContainer from "@/components/cards/CardContainer.vue";
import FolderCard from "@/components/notepad/FolderCard.vue";
import { CardCategory, CardFolder, CardTypes } from "@/core/model/cards";
import { Path } from "@/core/model/fileTree";
import { t as $t } from "@/core/translation";
import { useCardsStore } from "@/store/cards";
import { useFilterStore } from "@/store/filter";
import { usePreferencesStore } from "@/store/preferences";

const props = defineProps<{ category: CardCategory; folderPath?: Path }>();
const drag = ref(false);

const filterStore = useFilterStore();
const prefStore = usePreferencesStore();
const cardsStore = useCardsStore();

const folder = computed(() => {
	console.log(cardsStore.getCategoryFolder(props.category));
	const root = cardsStore.getCategoryFolder(props.category);
	// If a path is specified, get the folder it points to
	// Otherwise, keep the root folder as current folder
	const folder = props.folderPath ? root.getFolder(props.folderPath) : root;
	// Return root folder if no folder at specified path was found
	return folder ? folder : root;
});

const isSortDisabled = computed(() => {
	return filterStore.isFilterActive || prefStore.cardsOrder !== "default";
});

const files = computed({
	get(): CardTypes[] {
		return folder.value.files;
	},
	set(list: CardTypes[]) {
		cardsStore.updateWholeList(props.category, list);
	},
});

interface Cols {
	xs: number;
	sm: number;
	md: number;
	lg: number;
	xl?: number;
	xxl?: number;
}

// Compute card width for each breakpoint sizing based on the preferred density
const cols = computed<Cols>(() => {
	switch (prefStore.cardsDensity) {
		case "large":
			return { xs: 12, sm: 12, md: 6, lg: 6 };
		case "compact":
			return { xs: 12, sm: 6, md: 4, lg: 3 };
		case "comfortable":
		default:
			return { xs: 12, sm: 12, md: 6, lg: 4 };
	}
});

interface BreadcrumbItem {
	text: string;
	to: {
		name: string;
		params?: object;
	};
	disabled?: boolean;
	exact: true;
}

const router = useRouter();

function goBack() {
	router.back();
}

function openFolder(folder: CardFolder) {
	const path = new Path(folder.path, folder.metadata.name.toLowerCase());
	router.push({
		name: "Notepad",
		params: {
			folderURI: [...path.rawSegments], // Use spread syntax to convert readonly array to mutable one (typing issue only)
		},
	});
}

const breadcrumbs = computed(() => {
	if (folder.value.path.isRoot()) return [];

	const segments = folder.value.path.rawSegments;
	const root: BreadcrumbItem = {
		text: $t("pages.notepad"),
		to: { name: "Notepad" },
		disabled: false,
		exact: true,
	};

	const nextItems: BreadcrumbItem[] = segments.map((pathElement, idx, arr) => {
		const pathToCurrentElement = arr.slice(0, idx + 1).join("/");
		return {
			text: pathElement,
			to: {
				name: "Notepad",
				params: { folderURI: pathToCurrentElement },
			},
			disabled: idx === arr.length - 1,
			exact: true,
		};
	});

	return [root, ...nextItems];
});
</script>

<style scoped>
.draggable {
	cursor: grab;
}
</style>
