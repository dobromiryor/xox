import { describe, expect, test } from "vitest";
import { getResult } from "~/utils/getResult";

describe("get game result", () => {
  describe("for X", () => {
    test("horizontal wins", () => {
      x.horizontal.forEach((board) => {
        expect(getResult("X", board)).toBe("X");
      });
    });

    test("vertical wins", () => {
      x.vertical.forEach((board) => {
        expect(getResult("X", board)).toBe("X");
      });
    });

    test("diagonal wins", () => {
      x.diagonal.forEach((board) => {
        expect(getResult("X", board)).toBe("X");
      });
    });

    test("tie", () => {
      expect(getResult("X", tie)).toBe("TIE");
    });

    test("empty", () => {
      expect(getResult("O", empty)).toBe(undefined);
    });
  });

  describe("for O", () => {
    test("horizontal wins", () => {
      o.horizontal.forEach((board) => {
        expect(getResult("O", board)).toBe("O");
      });
    });

    test("vertical wins", () => {
      o.vertical.forEach((board) => {
        expect(getResult("O", board)).toBe("O");
      });
    });

    test("diagonal wins", () => {
      o.diagonal.forEach((board) => {
        expect(getResult("O", board)).toBe("O");
      });
    });

    test("tie", () => {
      expect(getResult("O", tie)).toBe("TIE");
    });

    test("empty", () => {
      expect(getResult("O", empty)).toBe(undefined);
    });
  });
});


const x = {
  horizontal: [
    [
      ["X", "X", "X"],
      [null, null, null],
      [null, null, null],
    ],
    [
      [null, null, null],
      ["X", "X", "X"],
      [null, null, null],
    ],
    [
      [null, null, null],
      [null, null, null],
      ["X", "X", "X"],
    ],
  ],
  vertical: [
    [
      ["X", null, null],
      ["X", null, null],
      ["X", null, null],
    ],
    [
      [null, "X", null],
      [null, "X", null],
      [null, "X", null],
    ],
    [
      [null, null, "X"],
      [null, null, "X"],
      [null, null, "X"],
    ],
  ],
  diagonal: [
    [
      ["X", null, null],
      [null, "X", null],
      [null, null, "X"],
    ],
    [
      [null, null, "X"],
      [null, "X", null],
      ["X", null, null],
    ],
  ],
};

const o = {
  horizontal: [
    [
      ["O", "O", "O"],
      [null, null, null],
      [null, null, null],
    ],
    [
      [null, null, null],
      ["O", "O", "O"],
      [null, null, null],
    ],
    [
      [null, null, null],
      [null, null, null],
      ["O", "O", "O"],
    ],
  ],
  vertical: [
    [
      ["O", null, null],
      ["O", null, null],
      ["O", null, null],
    ],
    [
      [null, "O", null],
      [null, "O", null],
      [null, "O", null],
    ],
    [
      [null, null, "O"],
      [null, null, "O"],
      [null, null, "O"],
    ],
  ],
  diagonal: [
    [
      ["O", null, null],
      [null, "O", null],
      [null, null, "O"],
    ],
    [
      [null, null, "O"],
      [null, "O", null],
      ["O", null, null],
    ],
  ],
};

const tie = [
  ["X", "O", "X"],
  ["X", "O", "X"],
  ["O", "X", "O"],
];

const empty = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];