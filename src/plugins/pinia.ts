import { createPinia } from "pinia";
import { createORM } from "pinia-orm";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

export default createPinia().use(createORM()).use(piniaPluginPersistedstate);
