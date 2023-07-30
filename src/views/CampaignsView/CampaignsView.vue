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
			@click="showAddDialog = true"
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
				<!-- Empty header column for the 'options' button -->
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
				<td>{{ $t("campaign.state.day") }} {{ campaign.days }}</td>
				<td>{{ campaign.loreEntries?.length }} {{ $t("campaign.state.entry") }}</td>
				<td>{{ getLastUpdate(campaign).toLocaleString() }}</td>
				<td class="text-right">
					<CardOptions :options="['delete']" @delete="confirmDelete(campaign)" />
				</td>
			</tr>
		</tbody>
	</v-table>

	<CampaignForm v-model="showAddDialog" @submit="addCampaign" />
</template>

<script lang="ts" setup>
import { useRepo } from "pinia-orm";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import CardOptions from "@/components/cards/CardOptions.vue";
import { useTryCatch } from "@/composables/tryCatch";
import { Campaign, Category } from "@/core/models";
import { CampaignRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import Icon from "@/core/utils/icons";
import { useGlobalConfirmDialog } from "@/store/confirmDialog";
import CampaignForm from "./content/CampaignForm.vue";

const campaignRepo = useRepo(CampaignRepo);

const router = useRouter();
const { showConfirmDialog } = useGlobalConfirmDialog();

const showAddDialog = ref(false);

const campaigns = computed(() => campaignRepo.withMeta().withAll().get());

function getLastUpdate(campaign: Campaign) {
	return campaign._meta?.updatedAt ? new Date(campaign._meta?.updatedAt * 1000) : new Date();
}

function addCampaign(campaign: Campaign) {
	campaignRepo.add(campaign);

	// Create the campaign's category root folders
	Object.values(Category).forEach((category) => {
		campaignRepo.createRootFolder(campaign, category);
	});
}

function openCampaign(campaign: Campaign) {
	router.push({ name: "LoreBookRoot", params: { campaignId: campaign.id } });
}

function confirmDelete(campaign: Campaign) {
	showConfirmDialog({
		title: $t("dialogs.deleteCampaign"),
		message: `${$t("dialogs.deleteConfirm")} "${campaign.name}" ? ${$t(
			"dialogs.deleteConfirmCampaign"
		)}`,
		confirmAction: () => useTryCatch(() => campaignRepo.delete(campaign.id)),
	});
}
</script>
