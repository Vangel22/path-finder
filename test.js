const { PathFinder } = require("./");

test("Basic example", () => {
  const testMapOne = [
    ["@", "-", "-", "-", "A", "-", "-", "-", "+"],
    [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
    ["x", "-", "B", "-", "+", " ", " ", " ", "C"],
    [" ", " ", " ", " ", "|", " ", " ", " ", "|"],
    [" ", " ", " ", " ", "+", "-", "-", "-", "+"],
  ];
  const pathFinder = new PathFinder(testMapOne);
  const result = pathFinder.traverse(testMapOne);
  expect(result.letters).toBe("ACB");
  expect(result.path).toBe("@---A---+|C|+---+|+-B-x");
});

test("Go straight through intersections", () => {
  const testMapTwo = [
    ["@", " "],
    ["|", " ", "+", "-", "C", "-", "-", "+"],
    ["A", " ", "|", " ", " ", " ", " ", "|"],
    ["+", "-", "-", "-", "B", "-", "-", "+"],
    [" ", " ", "|", " ", " ", " ", " ", " ", " ", "x"],
    [" ", " ", "|", " ", " ", " ", " ", " ", " ", "|"],
    [" ", " ", "+", "-", "-", "-", "D", "-", "-", "+"],
  ];
  const pathFinder = new PathFinder(testMapTwo);
  const result = pathFinder.traverse(testMapTwo);
  expect(result.letters).toBe("ABCD");
  expect(result.path).toBe("@|A+---B--+|+--C-+|-||+---D--+|x");
});

test("Letters may be found on turns", () => {
  const testMapThree = [
    ["@", "-", "-", "-", "A", "-", "-", "-", "+", " "],
    [" ", " ", " ", " ", " ", " ", " ", " ", "|", " "],
    ["x", "-", "B", "-", "+", " ", " ", " ", "|", " "],
    [" ", " ", " ", " ", "|", " ", " ", " ", "|", " "],
    [" ", " ", " ", " ", "+", "-", "-", "-", "C", " "],
  ];
  const pathFinder = new PathFinder(testMapThree);
  const result = pathFinder.traverse(testMapThree);
  expect(result.letters).toBe("ACB");
  expect(result.path).toBe("@---A---+|||C---+|+-B-x");
});

test("Do not collect a letter from the same location twice", () => {
  const testMapFour = [
    [" ", " ", " ", " ", "+", "-", "O", "-", "N", "-", "+"],
    [" ", " ", " ", " ", "|", " ", " ", " ", " ", " ", "|"],
    [" ", " ", " ", " ", "|", " ", " ", " ", "+", "-", "I", "-", "+"],
    ["@", "-", "G", "-", "O", "-", "+", " ", "|", " ", "|", " ", "|"],
    [" ", " ", " ", " ", "|", " ", "|", " ", "+", "-", "+", " ", "E"],
    [" ", " ", " ", " ", "+", "-", "+", " ", " ", " ", " ", " ", "S"],
    [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "|"],
    [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "x"],
  ];
  const pathFinder = new PathFinder(testMapFour);
  const result = pathFinder.traverse(testMapFour);
  expect(result.letters).toBe("GOONIES");
  expect(result.path).toBe("@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x");
});

// test("Keep direction, even in a compact space", () => {
//   const testMapFive = [
//     [" ", "+", "-", "L", "-", "+"],
//     [" ", "|", " ", " ", "+", "A", "-", "+"],
//     ["@", "B", "+", " ", "+", "+", " ", "H"],
//     [" ", "+", "+", " ", " ", " ", " ", "x"],
//   ];
//   const pathFinder = new PathFinder(testMapFive);
//   const result = pathFinder.traverse(testMapFive);
//   expect(result.letters).toBe("BLAH");
//   expect(result.path).toBe("@B+++B|+-L-+A+++A-+Hx");
// });

test("Ignore stuff after end of path", () => {
  const testMapSix = [
    [" ", "@", "-", "A", "-", "-", "+"],
    [" ", " ", " ", " ", " ", " ", "|"],
    [
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      "+",
      "-",
      "B",
      "-",
      "-",
      "x",
      "-",
      "C",
      "-",
      "D",
    ],
  ];
  const pathFinder = new PathFinder(testMapSix);
  const result = pathFinder.traverse(testMapSix);
  expect(result.letters).toBe("AB");
  expect(result.path).toBe("@-A--+|+-B--x");
});

test("Missing start character", () => {
  const testMapSeven = [
    [" ", " ", " ", "-", "A", "-", "-", "-", "+"],
    [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
    ["x", "-", "B", "-", "+", " ", " ", " ", "C"],
    [" ", " ", " ", " ", "|", " ", " ", " ", "|"],
    [" ", " ", " ", " ", "+", "-", "-", "-", "+"],
  ];
  const pathFinder = new PathFinder(testMapSeven);
  const result = pathFinder.traverse(testMapSeven);
  expect(result).toBe(Error);
});

test("Missing end character", () => {
  const testMapEight = [
    [" ", "@", "-", "-", "A", "-", "-", "-", "+"],
    [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
    [" ", " ", "B", "-", "+", " ", " ", " ", "C"],
    [" ", " ", " ", " ", "|", " ", " ", " ", "|"],
    [" ", " ", " ", " ", "+", "-", "-", "-", "+"],
  ];
  const pathFinder = new PathFinder(testMapEight);
  const result = pathFinder.traverse(testMapEight);
  expect(result).toBe(Error);
});
