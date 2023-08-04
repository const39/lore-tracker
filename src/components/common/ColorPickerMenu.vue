<template>
	<v-menu :close-on-content-click="false" location="left">
		<template #activator="{ props: menuProps }">
			<v-hover>
				<template #default="{ isHovering, props: hoverProps }">
					<div v-bind="mergeProps(menuProps, hoverProps)">
						<v-btn class="mr-1" size="x-large" variant="text" icon>
							<slot name="activator" v-bind="{ color }" />
							<v-fade-transition>
								<v-icon
									v-if="isHovering"
									class="picker-btn-overlay"
									size="x-small"
									icon="mdi-eyedropper-variant"
									color="white"
								/>
							</v-fade-transition>
						</v-btn>
					</div>
				</template>
			</v-hover>
		</template>
		<v-color-picker v-model="color" v-bind="$attrs" />
	</v-menu>
</template>

<script lang="ts" setup>
import { mergeProps } from "vue";
import { VColorPicker } from "vuetify/components";

defineSlots<{
	activator: (props: { color: string }) => any;
}>();

const color = defineModel<string>({ required: true }); // v-model
</script>
<style scoped>
.picker-btn-overlay {
	position: absolute;
	opacity: 0.75;
}
</style>
