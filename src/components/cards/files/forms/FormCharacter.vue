<template>
	<v-row>
		<v-col cols="6">
			<v-text-field
				v-model="model.name"
				:label="$t('fields.name') + '*'"
				:rules="[requiredRule]"
			/>
		</v-col>
		<v-col cols="6">
			<v-text-field v-model="model.race" :label="$t('fields.race')" />
		</v-col>
		<v-col cols="6">
			<v-text-field v-model="model.classes" :label="$t('fields.class')" />
		</v-col>
		<v-col cols="6">
			<v-text-field v-model="model.role" :label="$t('fields.role')" />
		</v-col>
		<v-col cols="6">
			<v-radio-group v-model="model.isNPC" column mandatory>
				<v-radio :label="$t('fields.player')" :value="false" />
				<v-radio :label="$t('fields.npc')" :value="true" />
			</v-radio-group>
		</v-col>
		<v-col cols="6">
			<v-checkbox v-model="model.isAlive" :label="$t('fields.alive')" />
		</v-col>
	</v-row>
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
import { Character } from "@/core/models";
import { t as $t } from "@/core/translation";
import { required } from "@/core/validationRules";

const model = defineModel<Character>({ required: true }); // v-model

const requiredRule = required($t("fields.requiredField"));
</script>
