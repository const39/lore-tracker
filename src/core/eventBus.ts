import mitt from "mitt";
import { Tag } from "@/core/model/cards";

type Events = {
	"select-tag": Tag;
};

export const eventBus = mitt<Events>();
