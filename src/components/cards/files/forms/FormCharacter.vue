<template>
	<v-row>
		<v-col cols="6">
			<v-text-field
				v-model="model.name"
				:label="$t('pages.loreBook.fields.labels.name') + '*'"
				:rules="[requiredRule]"
			/>
		</v-col>
		<v-col cols="6">
			<v-text-field v-model="model.race" :label="$t('pages.loreBook.fields.labels.race')" />
		</v-col>
		<v-col cols="6">
			<v-text-field
				v-model="model.classes"
				:label="$t('pages.loreBook.fields.labels.class')"
			/>
		</v-col>
		<v-col cols="6">
			<v-text-field v-model="model.role" :label="$t('pages.loreBook.fields.labels.role')" />
		</v-col>
		<v-col cols="6">
			<v-radio-group v-model="model.isNPC" column mandatory>
				<v-radio :label="$t('pages.loreBook.fields.labels.player')" :value="false" />
				<v-radio :label="$t('pages.loreBook.fields.labels.npc')" :value="true" />
			</v-radio-group>
		</v-col>
		<v-col cols="6">
			<v-checkbox v-model="model.isAlive" :label="$t('pages.loreBook.fields.labels.alive')" />
		</v-col>
	</v-row>
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
import { Character } from "@/core/models";
import { t as $t } from "@/core/translation";
import { required } from "@/core/validationRules";

const model = defineModel<Character>({ required: true }); // v-model

const requiredRule = required($t("pages.loreBook.fields.errors.requiredField"));
</script>
