import { Mark } from "~/enums/mark.enum";

export interface Player {
	presence_ref: string;
	name: string;
	mark: Mark;
}
