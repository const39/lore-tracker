/**
 * App version generated during the build phase.
 */
// @ts-ignore: Ignore typing because APP_VERSION is injected by Vite during the build phase.
export const VERSION = APP_VERSION;

export enum LocalStorageKey {
	DATA_KEY = "DATA",
	PREFERENCES_KEY = "PREFERENCES",
}

export enum Season {
	SPRING = "spring",
	SUMMER = "summer",
	AUTUMN = "autumn",
	WINTER = "winter",
}
