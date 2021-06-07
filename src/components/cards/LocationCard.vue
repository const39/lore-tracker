<template>
	<v-card class="mb-4">
		<v-card-text class="pa-3">
			<p class="text-h6 text--primary">{{ name }}</p>
			<p class="text--primary">{{ desc }}</p>
        </v-card-text>
	</v-card>
</template>

<script>
export default {
    name: "LocationCard",
    props: {
        id: Number,
        order: Number,
        name: String,
        desc: String
    }
};
</script>

<style></style>
