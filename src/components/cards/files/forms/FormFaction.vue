<template>
	<v-text-field
		v-model="model.name"
		:label="$t('pages.loreBook.fields.labels.name') + '*'"
		:rules="[requiredRule]"
	/>
	<v-textarea
		v-model="model.desc"
		:label="$t('pages.loreBook.fields.labels.desc')"
		:hint="$t('pages.loreBook.fields.labels.mdSupport')"
		variant="outlined"
		auto-grow
	/>
	<TagListPanel v-model="model.tags" :exclude-id="model.id" />
</template>

<script lang="ts" setup>
import TagListPanel from "@/components/cards/tags/TagListPanel.vue";
import { Faction } from "@/core/models";
import { t as $t } from "@/core/translation";
import { required } from "@/core/validationRules";

const model = defineModel<Faction>({ required: true }); // v-model

const requiredRule = required($t("pages.loreBook.fields.errors.requiredField"));
</script>
