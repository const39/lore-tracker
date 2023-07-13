<template>
	<Banner>
		<template #actions>
			<LorebookActions />
		</template>
	</Banner>

	<v-row>
		<v-slide-x-transition mode="in-out">
			<v-col v-show="sidePanel.isOpen" v-bind="cols">
				<SidePanel />
			</v-col>
		</v-slide-x-transition>
		<v-col cols="">
			<router-view />
		</v-col>
	</v-row>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import LorebookActions from "@/components/layout/banner/actions/LorebookActions.vue";
import Banner from "@/components/layout/banner/Banner.vue";
import { useSidePanel } from "@/store/sidePanel";
import SidePanel from "./content/SidePanel.vue";

const sidePanel = useSidePanel();

const cols = computed(() => {
	const base = sidePanel.state?.status === "file-form" ? 4 : 3;
	return { xs: 12, sm: 12, md: 12, lg: base };
});
</script>

<style scoped>
.sticky {
	position: sticky;
	top: 78px;
}
</style>
