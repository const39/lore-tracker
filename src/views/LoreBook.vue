<template>
	<Banner>
		<template #actions>
			<LorebookActions />
		</template>
	</Banner>

	<v-row>
		<v-slide-x-transition mode="in-out">
			<v-col v-show="isFormOpen" cols="4">
				<FormWrapper class="sticky-form" @change="($event) => (isFormOpen = $event)" />
			</v-col>
		</v-slide-x-transition>
		<v-col cols="">
			<LayoutTabs />
		</v-col>
	</v-row>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import FormWrapper from "@/components/cards/files/forms/FormWrapper.vue";
import LorebookActions from "@/components/layout/banner/actions/LorebookActions.vue";
import Banner from "@/components/layout/banner/Banner.vue";
import LayoutTabs from "@/components/layout/content/LayoutTabs.vue";

const isFormOpen = ref(false);
</script>

<style scoped>
.sticky-form {
	position: sticky;
	top: 78px;
}
</style>
