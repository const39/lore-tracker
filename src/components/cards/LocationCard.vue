<template>
	<v-card class="my-1">
		<v-card-title>
			<p class="text-subtitle-2 text--primary">{{ title }}</p>
		</v-card-title>
		<v-card-text>
			<p class="text-body-2 text--primary">{{ desc }}</p>
        </v-card-text>
	</v-card>
</template>

<script>
export default {
    name: "LocationCard",
    props: {
        id: Number,
        title: String,
        desc: String
    }
};
</script>

<style></style>
