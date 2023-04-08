import { t as $t } from "@/js/translation";
import { CardCategory, CardTypes, EventType, ID } from "@/js/types";
import utilities from "@/js/utilities";
import { useStore } from "@/store";
import { type Ref, ref, watch, computed } from "vue";
import type { VForm } from "vuetify/components";

export interface FormProps {
	category: CardCategory;
	edit?: number; // [Optional] leave undefined to use the "Add" form instead of "Edit" form
}

interface FormOptions {
	edit?: ID;
}

export function useForm<T = CardTypes>(
	formElement: Ref<VForm | undefined>,
	category: CardCategory,
	modelFactory: () => T,
	options: FormOptions = {}
) {
	const { edit = undefined } = options;

	const store = useStore();

	const isValid = ref(false);
	const model = ref<T>(initModel()) as Ref<T>;
	
	function initModel(): T {
		if (typeof edit !== "undefined") {
			const data = store.getByIdInCategory(edit, category);
			// We return a clone of the object to avoid modifying directly the store
			// Helpful when the user cancels their changes because we don't have to rollback
			if (data) return utilities.deepCopy(data) as unknown as T;
		}
		return modelFactory();
	}

	async function validate() {
		let res = false;
		if (formElement.value) isValid.value = res = (await formElement.value.validate()).valid;
		return res;
	}

	async function submit(cb: () => void) {
		if (await validate()) {
			// Update or add card based on form type
			if (typeof edit !== "undefined") store.commitAndSave({ commit: "updateCard", payload: model.value });
			else store.commitAndSave({ commit: "addCard", payload: model.value });
		}
		cb?.();
	}

	function reset() {
		model.value = initModel();
	}

	return { model, isValid, validate, submit, reset };
}

export function useFormOLD<T extends CardTypes>(emptyModelFactory: () => T, formElement: Ref<VForm | undefined>) {
	const props = defineProps<FormProps>();
	const valid = ref(false);
	const model = ref<T>(initModel());

	const emit = defineEmits<{
		(e: "close"): void;
	}>();
	const store = useStore();

	const requiredRule = [(v: string) => !!v || $t("fields.requiredField")];
	const categoryIcon = utilities.getIcon(model.value);

	async function submit() {
		await formElement.value?.validate();

		if (valid.value) {
			// HACK: Event-type specific process to ensure day if a Number and not a string
			// FIXME remove it when refactoring form mixin
			if (model.value.category === CardCategory.Event) model.value.day = Number(model.value.day);

			if (props.edit) store.commitAndSave({ commit: "updateCard", payload: model.value });
			else store.commitAndSave({ commit: "addCard", payload: model.value });

			close();
		}
	}

	function close(): void {
		model.value = initModel();
		// Fire a custom event to the parent component. The parent can decide to catch this event to react to the user action.
		emit("close");
	}

	function initModel(): T {
		if (typeof props.edit !== "undefined") {
			const data = store.getByIdInCategory(props.edit, props.category);
			// We return a clone of the object to avoid modifying directly the store
			// Helpful when the user cancels their changes because we don't have to rollback
			if (data) return utilities.deepCopy(data) as unknown as T;
		}
		return emptyModelFactory();
	}

	/**
	 * Observe the edit prop. When the prop changes, we update the model.
	 * The parent only have to pass the card ID to edit its data. When that ID changes, the form gets the relevant data to set the model.
	 */
	watch(
		() => props.edit,
		() => {
			model.value = initModel();
		}
	);

	return { props, valid, model, emit, store, requiredRule, categoryIcon, submit, close };
}
