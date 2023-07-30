<template>
	<div class="py-3 mb-4 text-h3">
		{{ $t("campaign.table.title") }}
	</div>
	<div class="py-3 text-h6">
		{{ $t("campaign.table.subtitle") }}
		<v-btn
			class="mx-1"
			icon="mdi-plus"
			density="compact"
			variant="text"
			@click="newCampaign"
		/>
	</div>
	<v-table hover>
		<thead>
			<tr>
				<th>
					<v-icon :icon="Icon.campaign" start />
					{{ $t("campaign.name") }}
				</th>
				<th>
					<v-icon icon="mdi-timelapse" start />
					{{ $t("campaign.table.progress") }}
				</th>
				<th>
					<v-icon :icon="Icon.note" start />
					{{ $t("campaign.table.entryCount") }}
				</th>
				<th>
					<v-icon icon="mdi-clock-outline" start />
					{{ $t("campaign.table.lastUpdate") }}
				</th>
				<th />
			</tr>
		</thead>
		<tbody>
			<tr
				v-for="(campaign, i) in campaigns"
				:key="i"
				class="clickable"
				@click="openCampaign(campaign)"
			>
				<td>{{ campaign.name }}</td>
				<td>
					{{ $t("campaign.state.day") }}
					{{ campaign.days }}
				</td>
				<!-- TODO -->
				<td>{{ Math.floor(Math.random() * 100) }} {{ $t("campaign.state.entry") }}</td>
				<td>{{ new Date().toLocaleString() }}</td>
				<td class="text-right">
					<CardOptions :options="['delete']" @delete="confirmDelete(campaign)" />
				</td>
			</tr>
		</tbody>
	</v-table>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import CardOptions from "@/components/cards/CardOptions.vue";
import { Campaign, Season } from "@/core/models";
import { t as $t } from "@/core/translation";
import Icon from "@/core/utils/icons";
import { useGlobalConfirmDialog } from "@/store/confirmDialog";

// TODO
const campaigns: Campaign[] = [
	new Campaign({ name: "Campagne A", days: 4, season: Season.AUTUMN }),
	new Campaign({ name: "Campagne B", days: 40, season: Season.SPRING }),
	new Campaign({ name: "Campagne C", days: 100, season: Season.WINTER }),
];

const router = useRouter();
const { showConfirmDialog } = useGlobalConfirmDialog();

function newCampaign() {
	// TODO
}

function openCampaign(campaign: Campaign) {
	router.push({ name: "LoreBookRoot", params: { campaignId: campaign.id } });
}

function confirmDelete(campaign: Campaign) {
	// TODO
	// showConfirmDialog({
	// 	title: $t(`dialogs.delete${utilities.capitalize(props.itemData.category)}`),
	// 	message: $t(`dialogs.deleteConfirm`) + `"${props.itemData.getText()}" ?`,
	// 	confirmAction: () => loreEntryRepo.delete(props.itemData.id),
	// });
}
</script>
