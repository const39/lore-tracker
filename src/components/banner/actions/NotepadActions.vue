<template>
	<div class="d-flex flex-column">
		<v-btn class="mx-2 my-1" @click="$emit('new-folder')">
			<v-icon left>mdi-plus</v-icon>
			<!-- TODO translate -->
			Folder	
		</v-btn>
		<v-btn class="mx-2 my-1" @click="$emit('new-file')">
			<v-icon left>mdi-plus</v-icon>
			<!-- TODO translate -->
			File
		</v-btn>
	</div>
</template>