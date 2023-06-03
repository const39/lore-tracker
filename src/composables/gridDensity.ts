import { computed } from "vue";
import { usePreferencesStore } from "@/store/preferences";

interface Cols {
	xs: number;
	sm: number;
	md: number;
	lg: number;
	xl?: number;
	xxl?: number;
}

export function useGridDensity() {
	const prefStore = usePreferencesStore();

	// Compute column width for each breakpoint sizing based on the preferred density
	const density = computed<Cols>(() => {
		switch (prefStore.cardsDensity) {
			case "large":
				return { xs: 12, sm: 12, md: 6, lg: 6 };
			case "compact":
				return { xs: 12, sm: 6, md: 4, lg: 3 };
			case "comfortable":
			default:
				return { xs: 12, sm: 12, md: 6, lg: 4 };
		}
	});

	return { density };
}
