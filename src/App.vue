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

			<v-icon @click="switchTheme"> {{themeIcon}} </v-icon>
		</v-app-bar>

		<v-main>
			<v-container>
				<router-view />
			</v-container>
		</v-main>
	</v-app>
</template>

<script>
const DARK_THEME_KEY = 'isDarkTheme';

export default {
	name: "App",
	methods: {
		switchTheme() {
			this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
			localStorage.setItem(DARK_THEME_KEY, this.$vuetify.theme.dark);
		}
	},
	computed: {
		themeIcon() {
			return this.$vuetify.theme.dark ? 'mdi-brightness-4' : 'mdi-brightness-7';
		}
	},
	created() {
		this.$vuetify.theme.dark = (localStorage.getItem(DARK_THEME_KEY) === 'true');
	}
};
</script>
