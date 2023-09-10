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
    this.markPath = [{ row: -1, col: -1 }];
  }

  findDirAvailable(arr, startRow, startCol, symbol) {
    if (symbol === SYMBOLS.START) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[j].length; j++) {
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

  replaceElementsByIndices(originalArray, indicesToReplace) {
    for (const indices of indicesToReplace) {
      if (indices[0] >= 0 && indices[0] < originalArray.length) {
        const row = indices[0];
        const col = indices[1];

        if (col >= 0 && col < originalArray[row].length) {
          originalArray[row][col] = SYMBOLS.MARK;
        }
      }
    }
  }

  checkAfterSymbolDirection(arr, startRow, startCol, symbol) {
    let startPostion = "";
    if (symbol === SYMBOLS.START) {
      startPostion = this.findDirAvailable(arr, startRow, startCol, symbol);
    } else {
      this.replaceElementsByIndices(arr, this.markPath);
      startPostion = this.findDirAvailable(arr, startRow, startCol, symbol);
    }
    let [up, down, left, right] = [false, false, false, false];

    console.log("checkAfterSymbolDirection", startPostion);
    console.log("path marked", this.markPath);

    if (startPostion === null) {
      console.log("Start symbol not found");
    }

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
      0,
      0,
      SYMBOLS.START
    );
    let dir = startAndNext;

    if (!Object.values(DIRECTION).includes(startAndNext.direction)) {
      console.log("DIRECTION NOT RECOGNIZED");
    }

    while (arr[dir.start.row][dir.start.col] !== SYMBOLS.END) {
      console.log("NEW DIR", dir);

      if (dir.direction === DIRECTION.UP) {
        dir = this.traverseUp(arr, dir.start.row, dir.start.col);
        break;
      }
      if (dir.direction === DIRECTION.DOWN) {
        dir = this.traverseDown(arr, dir.start.row, dir.start.col);
        break;
      }
      if (dir.direction === DIRECTION.LEFT) {
        dir = this.traverseLeft(arr, dir.start.row, dir.start.col);
        break;
      }
      if (dir.direction === DIRECTION.RIGHT) {
        dir = this.traverseRight(arr, dir.start.row, dir.start.col);
        continue;
      }
      // if (!dir.direction) {
      //   // Handle cases where the direction is not recognized
      //   console.log("DIRECTION NOT RECOGNIZED");
      //   break;
      // }
    }

    return {
      letters: this.collectAlphas.join(""),
      path: this.pathAlpha.join(""),
    };
  }

  traverseLeft(arr, startRow, startCol) {
    let newDirection = "";
    for (let j = startCol; j >= 0; j--) {
      this.markPath.push([startRow, j]);
      this.pathAlpha.push(arr[startRow][j]);
      if (arr[startRow][j] === SYMBOLS.NEW_DIR) {
        newDirection = this.checkAfterSymbolDirection(arr, SYMBOLS.NEW_DIR);
        break;
      }
      if (this.isAlpha(arr[startRow][j])) {
        this.collectAlphas.push(arr[startRow][j]);
      }
      if (arr[startRow][j] === SYMBOLS.HORIZONTAL) {
        continue;
      }
      if (arr[startRow][j] === SYMBOLS.END) {
        newDirection = SYMBOLS.END;
        break;
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
    };

    for (let j = startCol; j < arr[startRow].length; j++) {
      this.markPath.push([startRow, j]);
      this.pathAlpha.push(arr[startRow][j]);
      if (arr[startRow][j] === SYMBOLS.NEW_DIR) {
        newDirection = this.checkAfterSymbolDirection(
          arr,
          startRow,
          j,
          SYMBOLS.NEW_DIR
        );
        break;
      }
      if (this.isAlpha(arr[startRow][j])) {
        this.collectAlphas.push(arr[startRow][j]);
      }
      if (arr[startRow][j] === SYMBOLS.HORIZONTAL) {
        continue;
      }
      if (arr[startRow][j] === SYMBOLS.END) {
        newDirection = SYMBOLS.END;
        break;
      }
    }
    return newDirection;
  }
  traverseUp(arr, startRow, startCol) {
    let newDirection = "";
    for (let i = startRow - 1; i >= 0; i--) {
      this.markPath.push([i, startCol]);
      this.pathAlpha.push(arr[i][startCol]);
      if (arr[i][startCol] === SYMBOLS.NEW_DIR) {
        newDirection = this.checkAfterSymbolDirection(arr, SYMBOLS.NEW_DIR);
        break;
      }
      if (this.isAlpha(arr[i][startCol])) {
        this.collectAlphas.push(arr[i][startCol]);
      }
      if (arr[i][startCol] === SYMBOLS.HORIZONTAL) {
        continue;
      }
      if (arr[i][startCol] === SYMBOLS.END) {
        newDirection = SYMBOLS.END;
        break;
      }
    }
    return newDirection;
  }

  traverseDown(arr, startRow, startCol) {
    let newDirection = {
      start: {
        row: undefined,
        col: undefined,
      },
      direction: "",
    };

    for (let i = startRow + 1; i < arr.length; i++) {
      this.markPath.push([i, startCol]);
      this.pathAlpha.push(arr[i][startCol]);
      if (arr[i][startCol] === SYMBOLS.NEW_DIR) {
        //4 8
        newDirection = this.checkAfterSymbolDirection(
          arr,
          i,
          startCol,
          SYMBOLS.NEW_DIR
        );
        break;
      }
      if (this.isAlpha(arr[i][startCol])) {
        this.collectAlphas.push(arr[i][startCol]);
      }
      if (arr[i][startCol] === SYMBOLS.HORIZONTAL) {
        continue;
      }
      if (arr[i][startCol] === SYMBOLS.END) {
        newDirection = SYMBOLS.END; //this needs to be fixed
        break;
      }
    }

    console.log("new direction", newDirection);
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
