import { createRouter, createWebHistory, RouteLocation } from "vue-router";
import { CardCategory } from "@/core/model/cards";
import { Path } from "@/core/model/fileTree";
import LoreBook from "../views/LoreBook/LoreBook.vue";

const routes = [
	{
		path: "/lore-book",
		name: "LoreBookEmpty", // this route should not be used as is, it only serves as a parent URI for its children routes
		component: LoreBook,
		children: [
			{
				path: "",
				name: "LoreBook",
				// Redirects to the first category
				// ! To be changed manually if the LoreBook route changes because we cannot specify a name/params combinations on redirections
				redirect: { path: `/lore-book/${CardCategory.Quest}` },
			},
			{
				// Current folder sub-view
				path: ":category/:folderURI*",
				name: "LoreBookTab",
				component: () => import("../views/LoreBook/content/LayoutTabs.vue"),
				// Checks :category is indeed a valid category or redirect to 404 page if not
				beforeEnter: (to: RouteLocation) => {
					const cat = Array.isArray(to.params.category)
						? to.params.category[0]
						: to.params.category;

					const isValidCategory = (Object.values(CardCategory) as string[]).includes(cat);
					if (!isValidCategory) return { name: "NotFound" };
				},
				// Converts URI params to runtime objects passed as props to the component
				props: (route: RouteLocation) => ({
					category: route.params.category,
					folderPath: route.params.folderURI
						? new Path(...route.params.folderURI)
						: undefined,
				}),
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
