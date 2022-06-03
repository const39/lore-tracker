<template>
	<div class="text--primary">
		<v-row class="d-flex">
			<v-col class="flex-grow-0 flex-shrink-1">
				<v-chip label small>{{ command }} </v-chip>
			</v-col>
			<v-col class="flex-grow-1 flex-shrink-0">
				<span>{{ text }} </span>
			</v-col>
		</v-row>
	</div>
</template>

<script>
export default {
	props: {
		command: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
	},
};
</script>
