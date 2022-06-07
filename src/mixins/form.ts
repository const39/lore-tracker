import Vue, { PropType } from "vue";
import { CardCategory, CardTypes, EventType } from "@/js/types";
import utilities from "@/js/utilities";
import TagChooser from "@/components/cards/tags/TagChooser.vue";

export default Vue.extend({
	props: {
		category: String as PropType<CardCategory>,
		edit: Number, // [Optional] leave undefined to use the "Add" form instead of "Edit" form
	},
	components: {
		TagChooser,
	},
	data: function() {
		return {
			valid: false,
			requiredRule: [(v: string) => !!v || this.$t("fields.requiredField")],
			model: this.initModel(),
		};
	},
	methods: {
		submit(): void {
			this.$refs.form.validate();

			if (this.valid) {
				if (this.edit) this.$store.commit("update", this.model);
				else this.$store.commit("add", this.model);

				this.close();
			}
		},
		close(): void {
			this.model = this.initModel();
			// Fire a custom event to the parent component. The parent can decide to catch this event to react to the user action.
			this.$emit("close");
		},
		initModel(): CardTypes {
			if (typeof this.edit !== "undefined") {
				const data = this.$store.getters.get(this.edit, this.category);
				// We return a clone of the object to avoid modifying directly the store
				// Helpful when the user cancels their changes because we don't have to rollback
				if (data) return { ...data };
			}
			return this.createEmptyCardObject(this.category);
		},
		createEmptyCardObject(category: CardCategory): CardTypes {
			switch (category) {
				case CardCategory.Objective:
					return {
						_category: CardCategory.Objective,
						id: utilities.uid(),
						desc: "",
						tags: [],
						isCompleted: false,
					};
				case CardCategory.Event:
					return {
						_category: CardCategory.Event,
						id: utilities.uid(),
						desc: "",
						tags: [],
						type: EventType.OTHER,
						day: this.$store.state.days,
					};
				case CardCategory.Location:
					return {
						_category: CardCategory.Location,
						id: utilities.uid(),
						desc: "",
						tags: [],
						name: "",
					};
				case CardCategory.Character:
					return {
						_category: CardCategory.Character,
						id: utilities.uid(),
						desc: "",
						tags: [],
						name: "",
						race: "",
						classes: "",
						role: "",
						isAlive: true,
						isNPC: true,
					};
				case CardCategory.Note:
					return {
						_category: CardCategory.Note,
						id: utilities.uid(),
						desc: "",
						tags: [],
						title: "",
					};
			}
		},
	},
	watch: {
		/**
		 * Observe the edit prop. When the prop changes, we update the model.
		 * This is allows to use a unique dialog for all objective cards edits.
		 * The parent only have to pass the id of the objective to edit. When that id changes, the form gets the relevant data to set the model.
		 */
		edit: function(): void {
			this.model = this.initModel();
		},
	},
});
