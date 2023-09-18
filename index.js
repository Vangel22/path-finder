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
    this.copyMap = JSON.parse(JSON.stringify(map));
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

  checkAfterSymbolDirection(arr, startRow, startCol, symbol) {
    let startPostion = this.findDirAvailable(arr, startRow, startCol, symbol);

    if (startPostion === null) {
      return Error;
    }

    let [up, down, left, right] = [false, false, false, false];

    if (startPostion.row === 0 && startPostion.col === 0) {
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

    if (startPostion.row > 0 && startPostion.col > 0) {
      if (arr.length - startPostion.row > 1) {
        if (arr[startPostion.row + 1][startPostion.col] === SYMBOLS.VERTICAL) {
          down = true;
        }
      }
      //changed here with startPosition.row
      if (arr[startPostion.row].length - startPostion.col > 1) {
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

  checkStartAndMultiple(arr) {
    let numSym = 0;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        if (arr[i][j] === SYMBOLS.START) {
          numSym++;
        }
      }
    }

    if (numSym > 1) {
      //multiple starts
      return Error;
    } else if (numSym === 0) {
      //no start found
      return Error;
    } else {
      return "OK";
    }
  }

  checkEnd(arr) {
    let numX = 0;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        if (arr[i][j] === SYMBOLS.END) {
          numX++;
        }
      }
    }

    if (numX > 1) {
      //multiple starts
      return Error;
    } else if (numX === 0) {
      //no start found
      return Error;
    } else {
      return "OK";
    }
  }

  traverse(arr) {
    const startAndNext = this.checkAfterSymbolDirection(
      arr,
      0, //ignored
      0, //ignored
      SYMBOLS.START
    );
    let dir = startAndNext;

    //CHECK START
    const checkStart = this.checkStartAndMultiple(arr);
    if (checkStart !== "OK") {
      return checkStart;
    }
    const checkEnd = this.checkEnd(arr);
    if (checkEnd !== "OK") {
      return checkEnd;
    }

    if (!Object.values(DIRECTION).includes(startAndNext.direction)) {
      console.log("DIRECTION NOT RECOGNIZED");
    }

    while (true) {
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

    const pathString = "@" + this.pathAlpha.join("");
    return {
      letters: this.collectAlphas.join(""),
      path: pathString,
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
      if (arr[startRow][j] === " ") {
        this.pathAlpha.push(this.copyMap[startRow][j]);
      } else {
        this.pathAlpha.push(arr[startRow][j]);
      }
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
        //change here for direction change on letter
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

    let changeDirAfterAlpha;

    for (let j = startCol + 1; j < arr[startRow].length; j++) {
      if (arr[startRow][j] === " ") {
        this.pathAlpha.push(this.copyMap[startRow][j]);
        continue;
      } else {
        this.pathAlpha.push(arr[startRow][j]);
      }
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
        changeDirAfterAlpha = this.alphaNewDir(arr, startRow, j);
        if (changeDirAfterAlpha) {
          newDirection = changeDirAfterAlpha;
        }
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
    let changeDirAfterAlpha;

    for (let i = startRow - 1; i >= 0; i--) {
      if (arr[i][startCol] === " ") {
        this.pathAlpha.push(this.copyMap[i][startCol]);
        continue;
      } else {
        this.pathAlpha.push(arr[i][startCol]);
      }
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
        changeDirAfterAlpha = this.alphaNewDir(arr, i, startCol);
        if (changeDirAfterAlpha) {
          newDirection = changeDirAfterAlpha;
        }
        arr[i][startCol] = " ";
      }
      if (arr[i][startCol] === SYMBOLS.VERTICAL) {
        arr[i][startCol] = " ";
        continue;
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
      end: "",
    };

    let changeDirAfterAlpha;

    for (let i = startRow + 1; i < arr.length; i++) {
      if (arr[i][startCol] === " ") {
        this.pathAlpha.push(this.copyMap[i][startCol]);
      } else {
        this.pathAlpha.push(arr[i][startCol]);
      }
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
        changeDirAfterAlpha = this.alphaNewDir(arr, i, startCol);
        if (changeDirAfterAlpha) {
          newDirection = changeDirAfterAlpha;
        }
        arr[i][startCol] = " ";
      }
      if (arr[i][startCol] === SYMBOLS.VERTICAL) {
        console.log("vertical");
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

  alphaNewDir(arr, row, col) {
    // left up
    // right up
    // left down
    // right down
    let [left, right, up, down] = [false, false, false, false];
    const lastSymbolTraversed = this.pathAlpha.at(this.pathAlpha.length - 2);

    if (row === 0 && col === 0) {
      if (
        lastSymbolTraversed === SYMBOLS.VERTICAL &&
        arr[row][col + 1] === SYMBOLS.HORIZONTAL
      ) {
        right = true;
      }
      if (
        lastSymbolTraversed === SYMBOLS.HORIZONTAL &&
        arr[row + 1][col] === SYMBOLS.VERTICAL
      ) {
        down = true;
      }
    }
    if (row > 0 && col === 0) {
      if (
        lastSymbolTraversed === SYMBOLS.VERTICAL &&
        arr[row][col + 1] === SYMBOLS.HORIZONTAL
      ) {
        if (lastSymbolTraversed === SYMBOLS.VERTICAL) {
          right = true;
        }
      }
    }

    if (row === 0 && col > 0) {
      //left and down
      if (
        lastSymbolTraversed === SYMBOLS.HORIZONTAL &&
        arr[row + 1][col] === SYMBOLS.VERTICAL
      ) {
        if (lastSymbolTraversed === SYMBOLS.HORIZONTAL) {
          down = true;
        }
        if (lastSymbolTraversed === SYMBOLS.VERTICAL) {
          left = true;
        }
      }

      //right and down
      if (
        arr[row + 1][col] === SYMBOLS.VERTICAL &&
        arr[row].length - 1 > col + 1 &&
        arr[row][col + 1] === SYMBOLS.HORIZONTAL
      ) {
        if (lastSymbolTraversed === SYMBOLS.HORIZONTAL) {
          down = true;
        }
        if (lastSymbolTraversed === SYMBOLS.VERTICAL) {
          right = true;
        }
      }
    }

    if (row > 0 && col > 0) {
      //up left
      if (lastSymbolTraversed === SYMBOLS.HORIZONTAL) {
        if (arr[row - 1][col] === SYMBOLS.VERTICAL) {
          up = true;
        }
        if (row < arr.length - 1) {
          if (arr[row + 1][col] === SYMBOLS.VERTICAL) {
            down = true;
          }
        }
      }
      if (lastSymbolTraversed === SYMBOLS.VERTICAL) {
        if (arr[row][col - 1] === SYMBOLS.HORIZONTAL) {
          left = true;
        }
        if (arr[row][col + 1] === SYMBOLS.HORIZONTAL) {
          right = true;
        }
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

    return { start: { row, col }, direction: direction[0] };
  }
}

const testMapFive = [
  [" ", "+", "-", "L", "-", "+"],
  [" ", "|", " ", " ", "+", "A", "-", "+"],
  ["@", "B", "+", " ", "+", "+", " ", "H"],
  [" ", "+", "+", " ", " ", " ", " ", "x"],
];

// const pathOne = new PathFinder(testMapFive);
// console.log(pathOne.traverse(testMapFive));

module.exports = {
  PathFinder,
};
