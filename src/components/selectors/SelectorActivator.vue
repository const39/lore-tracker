<template>
	<v-menu offset-x left>
		<template v-slot:activator="{ on, attrs }">
			<v-list-item v-on="on" v-bind="attrs">
				<v-list-item-icon>
					<v-icon>{{ icon }}</v-icon>
				</v-list-item-icon>
				<v-list-item-title>{{ title }}</v-list-item-title>
			</v-list-item>
		</template>
		<slot></slot>
	</v-menu>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	props: {
		title: {
			type: String,
			required: true,
		},
		icon: String, // Optional icon
	},
});
</script>
