import { useCloned, watchDebounced } from "@vueuse/core";
import { MaybeRefOrGetter, Ref } from "vue";
import { VForm } from "vuetify/components";
import { deepCopy } from "@/core/utils/functions";

interface Options {
	validate?: boolean;
	debounceValidation?: number;
}

export function useFormModel<T = unknown>(
	initialValue: MaybeRefOrGetter<T>,
	form?: Ref<VForm | undefined | null>,
	options?: Options
) {
	// Get the model by cloning the initial value to avoid modifying the initial value itself
	const { cloned: model } = useCloned(initialValue, { clone: deepCopy });

	// Force trigger validation on any change in model properties because Vuetify does not do it by itself for some reason
	watchDebounced(
		model,
		() => {
			if (options?.validate) form?.value?.validate();
		},
		{ deep: true, debounce: options?.debounceValidation ?? 0 }
	);

	return model;
}
