<template>
	<v-container>
		<!-- <v-row>
			<p>Aller à :</p>
			<div class="text-center">
				<v-chip class="ma-2" v-for="panel in panels" :key="panel"> 
                    <a :href="`#${panel}`">{{ panel }}</a>
                </v-chip>
			</div>
		</v-row> -->

		<Panel :title="panels[0]">

        </Panel>
		<Panel :title="panels[1]">

        </Panel>
		<Panel :title="panels[2]">
            <LocationCard v-for="location in data.locations" :key="location.id" v-bind="location"></LocationCard>
        </Panel>
		<Panel :title="panels[3]">

        </Panel>
		<Panel :title="panels[4]">

        </Panel>
	</v-container>
</template>

<script>
import Panel from "./Panel.vue";
import LocationCard from "./cards/LocationCard.vue";

export default {
	name: "ConsecutivePanels",
	components: {
		Panel,
		LocationCard,
	},
	data() {
		return {
			panels: ["Objectifs", "Événements", "Localités", "Personnages", "Notes"],
            data: {
                locations: [
                    {
                        id: 0,
                        title: "Langdale",
                        desc: "Un petit village perdu dans une plaine. Une taverne, L'Auberge Noire, s'y trouve. Le village a connu une bataille lorsque..."
                    },
                    {
                        id: 1,
                        title: "Davenport",
                        desc: "Lorem ipsum..."
                    }
                ]
            }
		};
	},
};
</script>

<style></style>
