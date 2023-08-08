<template>
	<div class="my-3 text-center">
		<div class="text-xl-h4 my-3">
			{{ $t("pages.notFound.title") }}
		</div>
		<p>
			{{ $t("pages.notFound.message") }}
			<router-link :to="{ name: 'Campaigns' }">
				{{ $t("pages.campaigns.name") }}
			</router-link>
		</p>
	</div>
</template>

<script lang="ts" setup>
import { t as $t } from "@/core/translation";
</script>
