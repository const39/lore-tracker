<template>
    <v-card elevation="0">
        <v-card-title class="pa-2 text-overline">{{title}}</v-card-title>
        <v-card-text class="pa-2">
            <HotkeyElement v-for="hotkey in hotkeys" :key="hotkey.key" v-bind="hotkey"/>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import HotkeyElement from "./HotkeyElement.vue";

export default Vue.extend({
    components: {
        HotkeyElement
    },
    props: {
        hotkeys: {
            type: Array,
            required: true
        },
        title: {
            type: String,
            required: true
        }
    },
});
</script>
