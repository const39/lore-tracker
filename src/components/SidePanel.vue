<template>
    <v-card max-width="30%" max-height="500px">
        <v-card-text>
            <CardObjective v-for="objective in objectives" :key="objective.id" :itemData="objective" :outlined="true"/>  
            <CardEvent v-for="event in events" :key="event.id" :itemData="event" :outlined="true"/>  
            <CardLocation v-for="location in locations" :key="location.id" :itemData="location" :outlined="true"/>  
            <CardCharacter v-for="character in characters" :key="character.id" :itemData="character" :outlined="true"/>  
            <CardNote v-for="note in notes" :key="note.id" :itemData="note" :outlined="true"/>  
        </v-card-text>
    </v-card>
</template>

<script>
import CardObjective from "./cards/CardObjective.vue";
import CardEvent from "./cards/CardEvent.vue";
import CardLocation from "./cards/CardLocation.vue";
import CardCharacter from "./cards/CardCharacter.vue";
import CardNote from "./cards/CardNote.vue";

export default {
    components: {
		CardObjective,
		CardEvent,
		CardLocation,
		CardCharacter,
		CardNote,
    },
    computed: {
        objectives() {
            return this.$store.state.cards.objectives;
        },
        events() {
            return this.$store.state.cards.events;
        },
        locations() {
            return this.$store.state.cards.locations;
        },
        characters() {
            return this.$store.state.cards.characters;
        },
        notes() {
            return this.$store.state.cards.notes;
        },
    }
}
</script>
