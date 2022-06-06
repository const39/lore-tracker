import Vue from "vue";
import translation from "@/js/translation";

// Type augmentation for custom properties (translation function)
// see https://v2.vuejs.org/v2/guide/typescript.html
declare module "vue/types/vue" {
	interface Vue {
		$t: typeof translation.t;
	}
}
