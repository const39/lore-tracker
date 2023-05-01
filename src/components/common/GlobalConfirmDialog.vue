<template>
	<v-dialog v-model="state.show" max-width="375" persistent>
		<v-card>
			<v-card-title class="text-h5">
				{{ state.title }}
			</v-card-title>
			<v-card-text class="text-body-2">
				{{ state.message }}
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn variant="text" color="primary" @click="cancel">
					{{ $t("actions.no") }}
				</v-btn>
				<v-btn variant="text" @click="confirm">
					{{ $t("actions.yes") }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts" setup>
import { t as $t } from "@/core/translation";
import { useGlobalConfirmDialog } from "@/store/confirmDialog";

const { state, confirm, cancel } = useGlobalConfirmDialog();
</script>
