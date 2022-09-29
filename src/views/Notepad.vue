<template>
    <v-container>
		<Banner>
			<template v-slot:actions>
				<NotepadActions @new-dir="newDirectory" @new-file="newFile"></NotepadActions>
			</template>
		</Banner>


    </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import Banner from "@/components/banner/Banner.vue";
import NotepadActions from "@/components/banner/actions/NotepadActions.vue";

export default Vue.extend({
    components: {
        Banner,
        NotepadActions
    },
    methods: {
        newDirectory() {
            // TODO
        },
        newFile() {
            // TODO
        }
    }
})
</script>