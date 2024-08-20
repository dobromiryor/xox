import { type BoardType } from "~/types/board.type";

export const BOARD = Array.from(Array(3), () =>
	new Array(3).fill(null)
) as BoardType;
