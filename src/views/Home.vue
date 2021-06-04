<template>
	<v-container>
		<PanelsContainer></PanelsContainer>
	</v-container>
</template>

<script>
import PanelsContainer from "../components/PanelsContainer.vue";
// import Timeline from '../components/Timeline.vue';

export default {
	name: "Home",

	components: {
		// Timeline,
		PanelsContainer,
	},
};
</script>
