<template>
	<MenuActivator :title="$t('options.lang.optionName')" icon="mdi-translate">
		<v-list v-model:selected="selectedLang" density="compact" mandatory>
			<v-list-item
				v-for="lang in langList"
				:key="lang.key"
				:value="lang.key"
				:title="lang.name"
			>
				<template #prepend>
					<v-img
						:src="`/lang/${lang.key}.png`"
						class="mr-2"
						max-width="32"
						max-height="32"
					/>
				</template>
			</v-list-item>
		</v-list>
	</MenuActivator>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { t as $t, SupportedLanguages } from "@/js/translation";
import { usePreferencesStore } from "@/store/preferences";
import MenuActivator from "./MenuActivator.vue";

const prefStore = usePreferencesStore();

const selectedLang = ref([prefStore.language]);

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
	if (val.length) prefStore.language = val[0];
});
</script>
