<template>
	<v-menu bottom left>
		<template v-slot:activator="{ on, attrs }">
			<v-btn icon v-bind="attrs" v-on="on">
				<v-icon>mdi-dots-vertical</v-icon>
			</v-btn>
		</template>

		<v-list dense flat>
			<v-item-group mandatory>
				<v-list-item @click="fireSelectionEvent('edit')">
					<v-list-item-icon>
						<v-icon>mdi-pencil</v-icon>
					</v-list-item-icon>
					<v-list-item-title>Modifier</v-list-item-title>
				</v-list-item>
				<v-list-item @click="fireSelectionEvent('delete')">
					<v-list-item-icon>
						<v-icon>mdi-delete</v-icon>
					</v-list-item-icon>
					<v-list-item-title>Supprimer</v-list-item-title>
				</v-list-item>
			</v-item-group>
		</v-list>
	</v-menu>
</template>

<script>
export default {
    methods: {
        /**
         * Fire a custom event to the parent component. Event value can either be 'edit' or 'delete'.
         * The parent can decide to catch this event to react to the user action (e.g. to open a dialog).
         */
        fireSelectionEvent(selectedValue) {
            this.$emit('option-selected', selectedValue);
        }
    },
};
</script>

<style></style>
