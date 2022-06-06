<template>
	<div>
		<v-fab-transition origin="bottom right">
			<v-card v-if="open">
				<v-card-text>
					<div class="d-flex justify-space-between">
						<v-btn
							class="resizing-handle"
							icon
							@mousedown="onHold"
							@mousemove="resize"
							@mouseup="resizing = false"
						>
							<v-icon>mdi-cursor-move</v-icon>
						</v-btn>
						<p class="text-h6 text--primary">{{ $t("actions.quickNote") }}</p>
						<v-btn icon @click="open = false">
							<v-icon>mdi-chevron-down</v-icon>
						</v-btn>
					</div>
					<v-textarea
						id="resizable"
						outlined
						auto-grow
						autofocus
						:hint="$t('fields.mdSupport')"
						v-model="text"
					></v-textarea>
				</v-card-text>
			</v-card>
			<v-btn v-else fab color="primary" @click="open = true">
				<v-icon>mdi-text-box-edit</v-icon>
			</v-btn>
		</v-fab-transition>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	data() {
		return {
			open: false,
			resizing: false,
			originalW: 0,
			originalH: 0,
			originalX: 0,
			originalY: 0,
			originalMouseX: 0,
			originalMouseY: 0,
		};
	},
	methods: {
		onHold(e: MouseEvent) {
			const element = document.getElementById("resizable") as HTMLElement;
			e.preventDefault();
			this.originalW = Number.parseFloat(
				getComputedStyle(element, null)
					.getPropertyValue("width")
					.replace("px", "")
			);
			this.originalH = Number.parseFloat(
				getComputedStyle(element, null)
					.getPropertyValue("height")
					.replace("px", "")
			);
			this.originalX = element.getBoundingClientRect().left;
			this.originalY = element.getBoundingClientRect().top;
			this.originalMouseX = e.pageX;
			this.originalMouseY = e.pageY;

			this.resizing = true;
		},
		resize(e: MouseEvent) {
			const element = document.getElementById("resizable") as HTMLElement;
			const MIN_SIZE = 20;
			if (this.resizing) {
				const width = this.originalW - (e.pageX - this.originalMouseX);
				const height = this.originalH - (e.pageY - this.originalMouseY);
				if (width > MIN_SIZE) {
					element.style.width = width + "px";
					element.style.left = this.originalX + (e.pageX - this.originalMouseX) + "px";
				}
				if (height > MIN_SIZE) {
					element.style.height = height + "px";
					element.style.top = this.originalY + (e.pageY - this.originalMouseY) + "px";
				}
			}
		},
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
});
</script>

<style scoped>
.resizing-handle {
	cursor: nw-resize;
}
</style>
