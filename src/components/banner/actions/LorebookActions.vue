<template>
	<div>
		<!-- Card ordering selector -->
		<v-item-group class="d-block" mandatory v-model="selectedOrder">
			<v-item v-slot="{ active, toggle }">
				<v-tooltip top>
					<template v-slot:activator="{ on, attrs }">
						<v-btn icon v-bind="attrs" v-on="on" :color="active ? 'primary' : ''" @click="toggle">
							<v-icon v-if="active">mdi-sort-clock-descending</v-icon>
							<v-icon v-else>mdi-sort-clock-descending-outline</v-icon>
						</v-btn>
					</template>
					{{ $t("status.selectors.customOrder") }}
				</v-tooltip>
			</v-item>
			<v-item v-slot="{ active, toggle }">
				<v-tooltip top>
					<template v-slot:activator="{ on, attrs }">
						<v-btn icon v-bind="attrs" v-on="on" :color="active ? 'primary' : ''" @click="toggle">
							<v-icon>mdi-sort-alphabetical-variant</v-icon>
						</v-btn>
					</template>
					{{ $t("status.selectors.alphanumericOrder") }}
				</v-tooltip>
			</v-item>
		</v-item-group>
		<!-- Layout selector -->
		<v-item-group class="d-block" mandatory v-model="selectedLayout">
			<v-item v-slot="{ active, toggle }">
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<v-btn icon v-bind="attrs" v-on="on" :color="active ? 'accent' : ''" @click="toggle">
							<v-icon>mdi-tab</v-icon>
						</v-btn>
					</template>
					{{ $t("status.selectors.tabLayout") }}
				</v-tooltip>
			</v-item>
			<v-item v-slot="{ active, toggle }">
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<v-btn icon v-bind="attrs" v-on="on" :color="active ? 'accent' : ''" @click="toggle">
							<v-icon>mdi-view-column-outline</v-icon>
						</v-btn>
					</template>
					{{ $t("status.selectors.columnLayout") }}
				</v-tooltip>
			</v-item>
		</v-item-group>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	data() {
		return {
			selectedOrder: 0,
			selectedLayout: 0,
		};
	},
	watch: {
		selectedOrder(value) {
			this.$emit("order", value);
		},
		selectedLayout(value) {
			this.$emit("layout", value);
		},
	},
});
</script>
