import { useEventBus } from "@vueuse/core";

export type Events = "data-loaded";

export default useEventBus<Events>("events");
