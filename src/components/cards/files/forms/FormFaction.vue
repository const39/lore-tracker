<template>
	<v-text-field v-model="model.name" :label="$t('fields.name') + '*'" :rules="[requiredRule]" />
	<v-textarea
		v-model="model.desc"
		:label="$t('fields.desc')"
		:hint="$t('fields.mdSupport')"
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

const requiredRule = required($t("fields.requiredField"));
</script>
