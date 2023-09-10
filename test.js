// const { PathFinder } = require("./solution");

// test("Basic example", () => {
//   const map = [
//     "@---A---+",
//     "          |",
//     "  x-B-+   C",
//     "      |   |",
//     "      +---+",
//   ];
//   const pathFinder = new PathFinder(map);
//   const result = pathFinder.solve();
//   expect(result.collectedLetters).toBe("ACB");
//   expect(result.path).toBe("@---A---+|C|+---+|+-B-x");
// });

// test("Go straight through intersections", () => {
//   const map = [
//     "@",
//     "| +-C--+",
//     "A |    |",
//     "+---B--+",
//     "  |      x",
//     "  |      |",
//     "  +---D--+",
//   ];
//   const pathFinder = new PathFinder(map);
//   const result = pathFinder.solve();
//   expect(result.collectedLetters).toBe("ABCD");
//   expect(result.path).toBe("@|A+---B--+|+--C-+|-||+---D--+|x");
// });

// test("Letters may be found on turns", () => {
//   const map = [
//     "@---A---+",
//     "          |",
//     "  x-B-+   |",
//     "      |   |",
//     "      +---C",
//   ];
//   const pathFinder = new PathFinder(map);
//   const result = pathFinder.solve();
//   expect(result.collectedLetters).toBe("ACB");
//   expect(result.path).toBe("@---A---+|||C---+|+-B-x");
// });
