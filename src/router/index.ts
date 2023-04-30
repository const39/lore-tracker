import { createRouter, createWebHistory, RouteLocation } from "vue-router";
import LayoutTabContent from "@/components/layout/content/LayoutTabContent.vue";
import { CardCategory } from "@/core/model/cards";
import { Path } from "@/core/model/fileTree";
import LoreBook from "../views/LoreBook.vue";

const routes = [
	{
		path: "/lore-book",
		name: "LoreBookEmpty", // this route should not be used as is, it only serves as a parent URI for its children routes
		component: LoreBook,
		children: [
			{
				path: "",
				name: "LoreBook", // vue-router requires a name when using an empty path, but this route only serves as a redirection so we provide a dummy name
				redirect: { name: `LoreBook-${CardCategory.Quest}` },
			},
		],
	},
	{
		path: "/",
		redirect: { name: "LoreBook" },
	},
	{
		path: "/timeline",
		name: "Timeline",
		component: () => import("../views/Timeline.vue"),
	},
	{
		path: "/notepad/:folderURI*",
		name: "Notepad",
		component: () => import("../views/Notepad.vue"),
		props: (route: RouteLocation) => ({
			folderPath: route.params.folderURI ? new Path(...route.params.folderURI) : new Path(),
		}),
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

// Create a LoreBook sub-route dynamically for each card category
Object.values(CardCategory).forEach((category) => {
	router.addRoute("LoreBook", {
		path: `${category}/:folderURI*`,
		name: `LoreBook-${category}`,
		component: LayoutTabContent,
		props: (route: RouteLocation) => ({
			category,
			folderPath: route.params.folderURI ? new Path(...route.params.folderURI) : undefined,
		}),
	});
});

export default router;
