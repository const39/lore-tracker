import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		alias: "/home",
		name: "Home",
		component: Home,
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
	mode: process.env.IS_ELECTRON ? "hash" : "history",
});

export default router;
