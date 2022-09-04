<template>
	<v-container>
		<div class="my-3 text-center">
			<div class="text-xl-h4 my-3">{{ $t("notFound.title") }}</div>
			<p>
				{{ $t("notFound.message") }}
				<router-link :to="{ name: 'Home' }">{{ $t("pages.home") }}</router-link>
			</p>
		</div>
	</v-container>
</template>