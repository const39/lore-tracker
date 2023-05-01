<template>
	<Banner>
		<template #actions>
			<LorebookActions />
		</template>
	</Banner>

	<LayoutTabs />
</template>

<script lang="ts" setup>
import LorebookActions from "@/components/layout/banner/actions/LorebookActions.vue";
import Banner from "@/components/layout/banner/Banner.vue";
import LayoutTabs from "@/components/layout/content/LayoutTabs.vue";

</script>
