<template>
	<MenuActivator :title="$t('options.lang.optionName')" icon="mdi-translate">
		<v-list v-model:selected="selectedLang" density="compact" mandatory>
			<v-list-item v-for="lang in langList" :key="lang.key" :value="lang.key" :title="lang.name">
				<template #prepend>
					<v-img class="mr-2" max-width="32" max-height="32" :src="`/lang/${lang.key}.png`"></v-img>
				</template>
			</v-list-item>
		</v-list>
	</MenuActivator>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { ref, watch } from "vue";
import translation, { SupportedLanguages } from "@/js/translation";

import MenuActivator from "./MenuActivator.vue";

const selectedLang = ref([translation.getLanguage()]);

const langList = [
	{
		key: SupportedLanguages.FRENCH,
		name: "Français",
	},
	{
		key: SupportedLanguages.ENGLISH,
		name: "English",
	},
];

watch(selectedLang, (val) => {
	console.log("changing lang to", val);
	if(val.length) {
		translation.setLanguage(val[0]);
		window.location.reload();
	}
});
</script>

<style></style>
