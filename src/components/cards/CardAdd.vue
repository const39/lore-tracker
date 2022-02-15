<template>
	<v-hover v-slot="{ hover }">
		<v-card outlined class="my-1 custom-border" :class="{'grey': hover, 'lighten-3': !isDarkTheme, 'darken-3': isDarkTheme}">
			<!-- Fire a custom event to the parent component. The parent can decide to catch this event to react to the user action. -->
			<v-card-text class="text-center clickable" icon @click="$emit('click')">
				<v-icon>mdi-plus</v-icon>
			</v-card-text>
		</v-card>
	</v-hover>
</template>

<script>
export default {
    computed: {
        isDarkTheme() {
            return this.$vuetify.theme.dark;
        }
    }
};
</script>

<style scoped>
.custom-border {
	border-style: dashed;
}
.clickable:hover {
    cursor: pointer;
}
</style>
