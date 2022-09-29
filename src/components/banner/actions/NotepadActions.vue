<template>
	<div class="d-flex flex-column">
		<v-btn class="mx-2 my-1 grey lighten-2">
			<v-icon left @click="$emit('new-dir')">mdi-plus</v-icon>
			Folder
		</v-btn>
		<v-btn class="mx-2 my-1 grey lighten-2">
			<v-icon left @click="$emit('new-file')">mdi-plus</v-icon>
			File
		</v-btn>
	</div>
</template>