<template>
	<div>
		<v-row>
			<v-col cols="3">
				<v-chip size="small" label>
					<v-icon
						v-if="hold"
						icon="mdi-arrow-down-bold-circle-outline"
						color="grey-darken-1"
						start
					/>
					{{ command }}
				</v-chip>
			</v-col>
			<v-col>
				<span>{{ text }} </span>
			</v-col>
		</v-row>
	</div>
</template>

<script lang="ts" setup>
defineProps<{
	command: string;
	text: string;
	hold?: boolean;
}>();
</script>
