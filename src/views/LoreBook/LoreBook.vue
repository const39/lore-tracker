<template>
	<Banner>
		<template #actions>
			<LorebookActions />
		</template>
	</Banner>

	<router-view />
</template>

<script lang="ts" setup>
import LorebookActions from "@/components/layout/banner/actions/LorebookActions.vue";
import Banner from "@/components/layout/banner/Banner.vue";
</script>
