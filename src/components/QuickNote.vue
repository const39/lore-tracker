<template>
	<div>
		<v-expand-transition>
			<v-card v-if="opened">
				<v-card-text>
					<v-textarea outlined auto-grow autofocus :hint="$t('fields.mdSupport')" v-model="text"></v-textarea>
				</v-card-text>
			</v-card>
		</v-expand-transition>
		<v-btn class="text-left" :rounded="!opened" block color="primary" @click="opened = !opened">
			<v-icon :class="{ 'rotation': opened }">mdi-chevron-up</v-icon>
			{{ $t('actions.quickNote') }}
		</v-btn>
	</div>
</template>

<script>
export default {
	data() {
		return {
			opened: false,
		};
	},
    computed: {
		text: {
			get() {
				return this.$store.state.quickNote;
			},
			set(value) {
				this.$store.commit("changeQuickNote", value);
			},
		},
	},
};
</script>

<style scoped>
.rotation {
	animation: rotate 0.1s linear 1;
	transform: rotate(180deg);
}

@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(180deg);
	}
}
</style>
