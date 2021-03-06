import Vue, { PropType } from "vue";
import { CardCategory, CardTypes, EventType } from "@/js/types";
import utilities from "@/js/utilities";
import TagListPanel from "@/components/cards/tags/TagListPanel.vue";

// Provide form $ref type to TypeScript
type VForm = Vue & { validate: () => boolean };

export default Vue.extend({
	props: {
		category: String as PropType<CardCategory>,
		edit: Number, // [Optional] leave undefined to use the "Add" form instead of "Edit" form
	},
	components: {
		TagListPanel,
	},
	data() {
		return {
			valid: false,
			requiredRule: [(v: string) => !!v || this.$t("fields.requiredField")],
			model: (this as any).initModel(), // HACK: Type 'this' as any to avoid TS not finding initModel in the current this value
		};
	},
	methods: {
		/**
		 * TO IMPLEMENT BY CLIENT COMPONENTS if needed
		 */
		castCardData(card: CardTypes): CardTypes {
			return card;
		},
		submit(): void {
			(this.$refs.form as VForm).validate();

			if (this.valid) {

				this.model = this.castCardData(this.model);

				if (this.edit) this.$store.dispatch("commitAndSave", { commit: "updateCard", payload: this.model });
				else this.$store.dispatch("commitAndSave", { commit: "addCard", payload: this.model });

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
				const data = this.$store.getters.getByIdInCategory(this.edit, this.category);
				// We return a clone of the object to avoid modifying directly the store
				// Helpful when the user cancels their changes because we don't have to rollback
				if (data) return utilities.deepCopy(data) as CardTypes;
			}
			return this.createEmptyCardObject(this.category);
		},
		createEmptyCardObject(category: CardCategory): CardTypes {
			switch (category) {
				case CardCategory.Quest:
					return {
						_category: CardCategory.Quest,
						id: utilities.uid(),
						tags: [],
						title: "",
						tasks: [],
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
				case CardCategory.Faction:
					return {
						_category: CardCategory.Faction,
						id: utilities.uid(),
						desc: "",
						tags: [],
						name: "",
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
	computed: {
		categoryIcon(): string {
			return utilities.getIcon(this.model);
		},
	},
	watch: {
		/**
		 * Observe the edit prop. When the prop changes, we update the model.
		 * The parent only have to pass the card ID to edit its data. When that ID changes, the form gets the relevant data to set the model.
		 */
		edit: function(): void {
			this.model = this.initModel();
		},
	},
});
