const SYMBOLS = {
  START: "@",
  NEW_DIR: "+",
  HORIZONTAL: "-",
  VERTICAL: "|",
  END: "x",
  MARK: "=",
};

const DIRECTION = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
};

class PathFinder {
  constructor(map) {
    this.map = map;
    this.collectAlphas = [];
    this.pathAlpha = [];
    this.lastDir = [];
  }

  findDirAvailable(arr, startRow, startCol, symbol) {
    if (symbol === SYMBOLS.START) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
          if (arr[i][j] === symbol) {
            return { row: i, col: j };
          }
        }
      }
      return null;
    } else {
      for (let i = startRow; i < arr.length; i++) {
        for (let j = startCol; j < arr[startRow].length; j++) {
          if (arr[i][j] === symbol) {
            return { row: i, col: j };
          }
        }
      }
      return null; // Handle with test
    }
  }

  // removeTravercedIndices(originalArray, indicesToReplace) {
  //   for (const indices of indicesToReplace) {
  //     if (indices[0] >= 0 && indices[0] < originalArray.length) {
  //       const row = indices[0];
  //       const col = indices[1];

  //       if (col >= 0 && col < originalArray[row].length) {
  //         originalArray[row].splice(col, 1);
  //       }
  //     }
  //   }
  //   return originalArray;
  // }

  checkAfterSymbolDirection(arr, startRow, startCol, symbol) {
    const startPostion = this.findDirAvailable(arr, startRow, startCol, symbol);

    if (startPostion === null) {
      console.log("Start symbol not found");
    }

    let [up, down, left, right] = [false, false, false, false];

    // console.log("arr", arr);

    //up down check
    // if (
    //   this.lastDir[this.lastDir.length - 1].col ===
    //   this.lastDir[this.lastDir.length - 2]
    // ) {
    //   return false;
    // }

    if (startPostion.row === 0 && startPostion.col === 0) {
      // Check if the next position contains letter
      if (arr[startPostion.row + 1][startPostion.col] === SYMBOLS.VERTICAL) {
        down = true;
      } else if (
        arr[startPostion.row][startPostion.col + 1] === SYMBOLS.HORIZONTAL
      ) {
        right = true;
      }
    }
    if (startPostion.row > 0 && startPostion.col === 0) {
      if (arr[startPostion.row + 1][startPostion.col] === SYMBOLS.VERTICAL) {
        down = true;
      } else if (
        arr[startPostion.row - 1][startPostion.col] === SYMBOLS.VERTICAL
      ) {
        up = true;
      } else if (
        arr[startPostion.row][startPostion.col + 1] === SYMBOLS.HORIZONTAL
      ) {
        right = true;
      }
    }
    if (startPostion.row === 0 && startPostion.col > 0) {
      if (arr[startPostion.row + 1][startPostion.col] === SYMBOLS.VERTICAL) {
        down = true;
      } else if (
        arr[startPostion.row][startPostion.col + 1] === SYMBOLS.HORIZONTAL
      ) {
        right = true;
      } else if (
        arr[startPostion.row][startPostion.col - 1] === SYMBOLS.HORIZONTAL
      ) {
        left = true;
      }
    }
    // if we have a symetric matrix we won't need to check for col length
    if (startPostion.row > 0 && startPostion.col > 0) {
      if (arr.length - startPostion.row > 1) {
        if (arr[startPostion.row + 1][startPostion.col] === SYMBOLS.VERTICAL) {
          down = true;
        }
      }
      if (arr.length - startPostion.col > 1) {
        if (
          arr[startPostion.row][startPostion.col + 1] === SYMBOLS.HORIZONTAL
        ) {
          right = true;
        }
      }
      if (arr[startPostion.row][startPostion.col - 1] === SYMBOLS.HORIZONTAL) {
        left = true;
      }
      if (arr[startPostion.row - 1][startPostion.col] === SYMBOLS.VERTICAL) {
        up = true;
      }
    }

    const dirCheck = {
      up,
      down,
      left,
      right,
    };

    const direction = Object.entries(dirCheck)
      .filter(([_, isTrue]) => isTrue)
      .map(([direction]) => direction);

    return { start: startPostion, direction: direction[0] };
  }

  traverse(arr) {
    const startAndNext = this.checkAfterSymbolDirection(
      arr,
      0, //ignored
      0, //ignored
      SYMBOLS.START
    );
    let dir = startAndNext;

    if (!Object.values(DIRECTION).includes(startAndNext.direction)) {
      console.log("DIRECTION NOT RECOGNIZED");
    }

    while (true) {
      console.log("NEW DIR", dir);

      if (dir.direction === DIRECTION.UP) {
        dir = this.traverseUp(arr, dir.start.row, dir.start.col);
        if (dir.end === SYMBOLS.END) {
          break;
        }
        continue;
      }
      if (dir.direction === DIRECTION.DOWN) {
        dir = this.traverseDown(arr, dir.start.row, dir.start.col);
        if (dir.end === SYMBOLS.END) {
          break;
        }
        continue;
      }
      if (dir.direction === DIRECTION.LEFT) {
        dir = this.traverseLeft(arr, dir.start.row, dir.start.col);
        if (dir.end === SYMBOLS.END) {
          break;
        }
        continue;
      }
      if (dir.direction === DIRECTION.RIGHT) {
        dir = this.traverseRight(arr, dir.start.row, dir.start.col);

        if (dir.end === SYMBOLS.END) {
          break;
        }
        continue;
      }
    }

    return {
      letters: this.collectAlphas.join(""),
      path: this.pathAlpha.join(""),
    };
  }

  traverseLeft(arr, startRow, startCol) {
    let newDirection = {
      start: {
        row: undefined,
        col: undefined,
      },
      direction: "",
      end: "",
    };

    for (let j = startCol - 1; j >= 0; j--) {
      this.pathAlpha.push(arr[startRow][j]);
      if (arr[startRow][j] === SYMBOLS.END) {
        newDirection.end = SYMBOLS.END;
        break;
      }
      if (arr[startRow][j] === SYMBOLS.NEW_DIR) {
        newDirection = this.checkAfterSymbolDirection(
          arr,
          startRow,
          j,
          SYMBOLS.NEW_DIR
        );
        arr[startRow][j] = " ";
        break;
      }
      if (this.isAlpha(arr[startRow][j])) {
        this.collectAlphas.push(arr[startRow][j]);
        arr[startRow][j] = " ";
      }
      if (arr[startRow][j] === SYMBOLS.HORIZONTAL) {
        arr[startRow][j] = " ";
        continue;
      }
    }

    return newDirection;
  }
  traverseRight(arr, startRow, startCol) {
    let newDirection = {
      start: {
        row: undefined,
        col: undefined,
      },
      direction: "",
      end: "",
    };

    for (let j = startCol; j < arr[startRow].length; j++) {
      this.pathAlpha.push(arr[startRow][j]);
      if (arr[startRow][j] === SYMBOLS.END) {
        newDirection.end = SYMBOLS.END;
        break;
      }
      if (arr[startRow][j] === SYMBOLS.NEW_DIR) {
        // + sign
        newDirection = this.checkAfterSymbolDirection(
          arr,
          startRow,
          j,
          SYMBOLS.NEW_DIR
        );
        arr[startRow][j] = " ";
        break;
      }
      if (this.isAlpha(arr[startRow][j])) {
        this.collectAlphas.push(arr[startRow][j]);
        arr[startRow][j] = " ";
      }
      if (arr[startRow][j] === SYMBOLS.HORIZONTAL) {
        arr[startRow][j] = " ";
        continue;
      }
    }

    return newDirection;
  }
  traverseUp(arr, startRow, startCol) {
    let newDirection = {
      start: {
        row: undefined,
        col: undefined,
      },
      direction: "",
      end: "",
    };
    for (let i = startRow - 1; i >= 0; i--) {
      this.pathAlpha.push(arr[i][startCol]);
      if (arr[i][startCol] === SYMBOLS.END) {
        newDirection.end = SYMBOLS.END;
        break;
      }
      if (arr[i][startCol] === SYMBOLS.NEW_DIR) {
        newDirection = this.checkAfterSymbolDirection(
          arr,
          i,
          startCol,
          SYMBOLS.NEW_DIR
        );
        arr[i][startCol] = " ";
        break;
      }
      if (this.isAlpha(arr[i][startCol])) {
        this.collectAlphas.push(arr[i][startCol]);
        arr[i][startCol] = " ";
      }
      if (arr[i][startCol] === SYMBOLS.VERTICAL) {
        arr[i][startCol] = " ";
        continue;
      }
    }
    this.lastDir = newDirection.direction;
    return newDirection;
  }

  traverseDown(arr, startRow, startCol) {
    let newDirection = {
      start: {
        row: undefined,
        col: undefined,
      },
      direction: "",
      end: "",
    };

    for (let i = startRow + 1; i < arr.length; i++) {
      this.pathAlpha.push(arr[i][startCol]);
      if (arr[i][startCol] === SYMBOLS.END) {
        newDirection.end = SYMBOLS.END;
        break;
      }
      if (arr[i][startCol] === SYMBOLS.NEW_DIR) {
        newDirection = this.checkAfterSymbolDirection(
          arr,
          i,
          startCol,
          SYMBOLS.NEW_DIR
        );
        arr[i][startCol] = " ";
        break;
      }
      if (this.isAlpha(arr[i][startCol])) {
        this.collectAlphas.push(arr[i][startCol]);
        arr[i][startCol] = " ";
      }
      if (arr[i][startCol] === SYMBOLS.VERTICAL) {
        arr[i][startCol] = " ";
        continue;
      }
    }

    return newDirection;
  }

  checkRowLength(arr, row) {
    return arr[row].length - 1;
  }

  isAlpha = function (ch) {
    return /^[A-Z]$/i.test(ch);
  };
}

const testMapOne = [
  ["@", "-", "-", "-", "A", "-", "-", "-", "+"],
  [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
  ["x", "-", "B", "-", "+", " ", " ", " ", "C"],
  [" ", " ", " ", " ", "|", " ", " ", " ", "|"],
  [" ", " ", " ", " ", "+", "-", "-", "-", "+"],
];

const testMapTwo = [
  ["@", " "],
  ["|", " ", "+", "-", "C", "-", "-", "+"],
  ["A", " ", "|", " ", " ", " ", " ", "|"],
  ["+", "-", "-", "-", "B", "-", "-", "+"],
  [" ", " ", " ", " ", " ", " ", " ", "x"],
  [" ", " ", " ", " ", " ", " ", " ", "|"],
  [" ", " ", " ", " ", " ", " ", " ", "+"],
];

const testMapThree = [
  [" ", " ", "+", "-", "O", "-", "N", "-", "+"],
  [" ", " ", "|", " ", " ", " ", " ", " ", "|"],
  [" ", " ", "|", " ", " ", "+", "-", "I", "-", "+"],
  ["@", "-", "G", "-", "O", "-", "+", " ", "|", " ", "|"],
  [" ", " ", "|", " ", "|", " ", "+", "-", "+", " ", "E"],
  [" ", "+", "-", "+", " ", " ", " ", " ", " ", "S"],
  [" ", " ", " ", " ", " ", " ", "|"],
  [" ", " ", " ", " ", " ", " ", "x"],
];

// const watchDuplicationPath = [
//   [" ", " ", "+", "-", "O", "-", "N", "-", "+"],
//   [" ", " ", "|", " ", " ", " ", " ", " ", "|"],
//   [" ", " ", "|", " ", " ", "+", "-", "I", "-", "+"],
//   ["@", "-", "G", "-", "O", "-", "+", " ", "|", " ", "|"],
//   [" ", " ", "|", " ", "|", " ", "+", "-", "+", " ", "E"],
//   [" ", "+", "-", "+", " ", " ", " ", " ", " ", "S"],
//   [" ", " ", " ", " ", " ", " ", "|"],
//   [" ", " ", " ", " ", " ", " ", "x"],
// ];

const crampedLetters = [
  [" ", "+", "-", "L", "-", "+"],
  [" ", "|", " ", " ", "+", "A", "-", "+"],
  ["@", "B", "+", " ", "+", "+", " ", "H"],
  [" ", "+", "+", " ", " ", " ", " ", "x"],
];

// const testMapFour = [
//   ["+", "-", "@", " ", "A", "-", "-", "+"],
//   ["|", " ", " ", " ", "|", " ", " ", "|"],
//   ["|", "x", "-", "B", "+", " ", " ", "C"],
//   ["|", " ", " ", " ", " ", " ", " ", "|"],
//   ["+", "-", "-", "-", "-", "-", "-", "+"],
// ];

const testUp = [
  [" ", "+", "-", "+"],
  [" ", "|", " ", "|", " ", " ", " ", " "],
  [" ", "@", " ", "+", "-", "A", "-", "x"],
];

const pathOne = new PathFinder(testMapOne);
console.log(pathOne.traverse(testMapOne));
