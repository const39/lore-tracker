<template>
	<v-app>
		<v-app-bar app color="primary" dark>
			<div class="d-flex align-center">
				<div class="text-xl-h4 text-center">RPG campaign tracker</div>
			</div>

			<v-spacer></v-spacer>

			<router-link to="/">
				<v-btn text>
					<span class="mr-2">Home</span>
				</v-btn>
			</router-link>
			<router-link to="/timeline">
				<v-btn text>
					<span class="mr-2">Timeline</span>
				</v-btn>
			</router-link>
			<!-- *** Non-implemented routes *** -->
			<!-- 
			<router-link to="/dice">
				<v-btn text>
					<span class="mr-2">Dice</span>
				</v-btn>
			</router-link> -->
		</v-app-bar>

		<v-main>
			<v-container>
				<router-view />
			</v-container>
		</v-main>
	</v-app>
</template>

<script>
export default {
	name: "App",

	data: () => ({
		//
	}),
};
</script>
