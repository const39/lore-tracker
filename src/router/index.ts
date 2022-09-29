import Vue from "vue";
import VueRouter from "vue-router";
import LoreBook from "../views/LoreBook.vue";

Vue.use(VueRouter);

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
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ "../views/Timeline.vue"),
	},
	{
		path: "/notepad",
		name: "Notepad",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ "../views/Notepad.vue"),
	},
	{
		path: "*",
		name: "NotFound",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ "../views/NotFound.vue"),
	}
];

const router = new VueRouter({
	routes,
	mode: "history",
});

export default router;
