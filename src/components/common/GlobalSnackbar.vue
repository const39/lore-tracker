<template>
	<v-snackbar v-model="state.show" :timeout="state.timeout" :color="state.color">
		<div class="d-flex align-center">
			<v-icon v-if="state.icon" :icon="state.icon" start />
			{{ state.message }}
		</div>
		<template #actions>
			<v-btn icon="mdi-close" @click="closeSnackbar" />
		</template>
	</v-snackbar>
</template>

<script lang="ts" setup>
import { useGlobalSnackbar } from "@/store/snackbar";

const { state, closeSnackbar } = useGlobalSnackbar();
</script>
