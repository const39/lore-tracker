import mitt from "mitt";
import { CardTypes, Tag } from "./types";

type Events = {
	"delete-card": CardTypes;
	"select-tag": Tag;
	"show-snackbar": { message: string; timeout: number; color: string };
};

export const eventBus = mitt<Events>();
