import { CardTypes, Tag } from "./types";
import mitt from "mitt";

type Events = {
	"delete-card": CardTypes;
	"select-tag": Tag;
	"show-snackbar": { message: string; timeout: number; color: string };
};

export const eventBus = mitt<Events>();
