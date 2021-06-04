<template>
    <v-card class="my-4" :id="title">
        <v-card-title>
            <p class="text-h5 text--primary"> {{title}} </p>
        </v-card-title>
        <v-card-text>
            <slot></slot>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: "Panel",
    props: {
        title: String,
    }
}
</script>

<style>

</style>