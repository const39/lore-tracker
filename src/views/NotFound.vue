<template>
	<div class="my-3 text-center">
		<div class="text-xl-h4 my-3">{{ $t("notFound.title") }}</div>
		<p>
			{{ $t("notFound.message") }}
			<router-link :to="{ name: 'LoreBook' }">{{ $t("pages.loreBook") }}</router-link>
		</p>
	</div>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
</script>
