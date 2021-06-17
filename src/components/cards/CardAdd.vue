<template>
	<v-hover v-slot="{ hover }">
		<v-card outlined class="my-1 custom-border" :class="{'grey': hover, 'lighten-3': !isDarkTheme, 'darken-3': isDarkTheme}">
			<v-card-text class="text-center clickable" icon @click="onClick">
				<v-icon>mdi-plus</v-icon>
			</v-card-text>
		</v-card>
	</v-hover>
</template>

<script>
export default {
    methods: {
        /**
         * Send a custom event to the parent component to allow this AddCard component to update some attribute.
         * This is used to allow this component to act as an external activator for a custom dialog component.
         */
        onClick() {
            this.$emit('add-card-clicked')
        },
    },
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
