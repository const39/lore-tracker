import { createRouter, createWebHistory, RouteLocation } from "vue-router";
import { Category } from "@/core/models";
import CampaignsView from "../views/CampaignsView/CampaignsView.vue";

const routes = [
	{
		path: "/",
		name: "Home",
		redirect: { name: "Campaigns" },
	},
	{
		path: "/campaigns",
		name: "Campaigns",
		component: CampaignsView,
	},
	{
		path: "/campaigns/:campaignId/lore-book",
		name: "LoreBookRoot",
		redirect: (to: RouteLocation) => {
			return { name: "LoreBook", params: { ...to.params, category: Category.Quest } };
		},
	},
	{
		path: "/campaigns/:campaignId/lore-book/:category/:folderId?",
		name: "LoreBook",
		props: true, // pass route.params as component props
		component: () => import("../views/LoreBook/LoreBook.vue"),
		// Checks :category is indeed a valid category or redirect to 404 page if not
		beforeEnter: (to: RouteLocation) => {
			const cat = Array.isArray(to.params.category)
				? to.params.category[0]
				: to.params.category;

			const isValidCategory = (Object.values(Category) as string[]).includes(cat);
			if (!isValidCategory) return { name: "NotFound" };
		},
	},
	{
		path: "/campaigns/:campaignId/timeline",
		name: "Timeline",
		component: () => import("../views/Timeline.vue"),
	},
	{
		path: "/:dummyParam(.*)*",
		name: "NotFound",
		component: () => import("../views/NotFound.vue"),
	},
];

const router = createRouter({
	routes,
	history: createWebHistory(),
});

export default router;
