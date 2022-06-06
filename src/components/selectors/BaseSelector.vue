<template>
	<v-card>
		<v-card-text>
			<v-item-group mandatory active-class="active">
				<v-container>
					<v-row class="d-flex justify-space-between">
						<div class="text-center text--primary" v-for="item in items" :key="item.key">
							<v-item class="ma-1" v-slot="{ toggle }">
								<div @click="$emit('change', item.key); toggle();">
									<slot v-bind="item"></slot>
								</div>
							</v-item>
						</div>
					</v-row>
				</v-container>
			</v-item-group>
		</v-card-text>
	</v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

interface IndexableObject {
	key: object
}

export default Vue.extend({
	props: {
		items: {
			type: Array as PropType<IndexableObject[]>,
			required: true,
		},
	},
});
</script>
<style scoped>
.active {
	background-color: var(--v-accent-base); 
	border: 3px solid var(--v-accent-base);
}
</style>