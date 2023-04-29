import { createRouter, createWebHistory, RouteLocation } from "vue-router";
import { Path } from "@/js/model/fileTree";
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

export default createRouter({
	routes,
	history: createWebHistory(),
});
