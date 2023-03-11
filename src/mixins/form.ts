import { t as $t } from "@/js/translation";
import { CardCategory, CardTypes, EventType } from "@/js/types";
import utilities from "@/js/utilities";
import { useStore } from "@/store";
import { ref, watch } from "vue";

export interface FormProps {
	category: CardCategory;
	edit?: number; // [Optional] leave undefined to use the "Add" form instead of "Edit" form
}

export function useForm<T extends CardTypes>(emptyModelFactory: () => T, formElement: { validate: () => boolean }) {
	const props = defineProps<FormProps>();
	const valid = ref(false);
	const model = ref<T>(initModel());

	const emit = defineEmits<{
		(e: "close"): void;
	}>();
	const store = useStore();

	const requiredRule = [(v: string) => !!v || $t("fields.requiredField")];
	const categoryIcon = utilities.getIcon(model.value);

	function submit(): void {
		formElement?.validate();

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
