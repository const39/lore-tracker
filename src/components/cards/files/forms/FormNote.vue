<template>
	<v-text-field v-model="model.title" :label="$t('pages.loreBook.fields.labels.title')" />
	<v-textarea
		v-model="model.desc"
		:label="$t('pages.loreBook.fields.labels.desc') + '*'"
		:hint="$t('pages.loreBook.fields.labels.mdSupport')"
		:rules="[requiredRule]"
		variant="outlined"
		auto-grow
	/>
	<TagListPanel v-model="model.tags" :exclude-id="model.id" />
</template>

<script lang="ts" setup>
import TagListPanel from "@/components/cards/tags/TagListPanel.vue";
import { Note } from "@/core/models";
import { t as $t } from "@/core/translation";
import { required } from "@/core/validationRules";

const model = defineModel<Note>({ required: true }); // v-model

const requiredRule = required($t("pages.loreBook.fields.errors.requiredField"));
</script>
