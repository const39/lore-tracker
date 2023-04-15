import { RouteLocation, createRouter, createWebHistory } from "vue-router";
import LoreBook from "../views/LoreBook.vue";

const routes = [
	{
		path: "/",
		alias: "/lore-book",
		name: "LoreBook",
		component: LoreBook,
	},
	{
		path: "/timeline",
		name: "Timeline",
		component: () => import("../views/Timeline.vue"),
	},
	{
		path: "/notepad/:folderPath*",
		name: "Notepad",
		component: () => import("../views/Notepad.vue"),
		props: (route: RouteLocation) => ({
			routeName: "Notepad",
			folderPath: route.params.folderPath || "/",
		}),
	},
	{
		path: "/:dummyParam(.*)*",
		name: "NotFound",
		component: () => import("../views/NotFound.vue"),
	},
];

export default createRouter({
	routes,
	history: createWebHistory(),
});
