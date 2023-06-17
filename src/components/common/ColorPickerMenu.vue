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
import { computed, mergeProps } from "vue";
import { VColorPicker } from "vuetify/components";

/**
 * TODO: Replace with Vue's native ExtractPublicPropTypes when available
 * @see https://vuejs.org/api/utility-types.html#extractpublicproptypes
 */
type PropsType<TComponent> = TComponent extends new () => {
	$props: infer P;
}
	? P
	: never;

interface Props extends PropsType<typeof VColorPicker> {
	modelValue: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	(e: "update:modelValue", value: string): void;
}>();

// v-model binding
const color = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});
</script>
<style scoped>
.picker-btn-overlay {
	position: absolute;
	opacity: 0.75;
}
</style>
