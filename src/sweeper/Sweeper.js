import React from "react";
import SweeperBoard from "./SweeperBoard";
import _ from "lodash";

// Represents a single Sweeper game
export default class Sweeper extends React.Component {
  static DISPLAY_STATES = {
    REVEALED_0: 0,
    REVEALED_1: 1,
    REVEALED_2: 2,
    REVEALED_3: 3,
    REVEALED_4: 4,
    REVEALED_5: 5,
    REVEALED_6: 6,
    REVEALED_7: 7,
    REVEALED_8: 8,
    UNREVEALED: 9,
    REVEALED_MINE: 10,
    // Flagging not currently supported
    FLAGGED: 11,
    FALSE_FLAG: 12,
  };

  static MINE_STATES = {
    EMPTY_0: 0,
    EMPTY_1: 1,
    EMPTY_2: 2,
    EMPTY_3: 3,
    EMPTY_4: 4,
    EMPTY_5: 5,
    EMPTY_6: 6,
    EMPTY_7: 7,
    EMPTY_8: 8,
    MINED: 9,
  };

  constructor(props) {
    super(props);

    // Create cells
    const cells = Array.from(Array(props.rows), () =>
      Array(props.cols).fill(Sweeper.DISPLAY_STATES.UNREVEALED)
    );

    // Create mines
    const mines = Array.from(Array(props.rows), () =>
      Array(props.cols).fill(Sweeper.MINE_STATES.EMPTY_0)
    );
    const randomMines = _.shuffle(
      Array.from(Array(props.rows * props.cols), (ele, idx) => idx)
    );
    console.log(randomMines);
    _.times(props.mines, (idx) => {
      mines[randomMines[idx] % props.cols][
        Math.floor(randomMines[idx] / props.cols)
      ] = Sweeper.MINE_STATES.MINED;
    });
    for (let row = 0; row < props.rows; row++) {
      for (let col = 0; col < props.cols; col++) {
        if (mines[row][col] !== Sweeper.MINE_STATES.MINED) {
          mines[row][col] = Sweeper.#countAdjacentMines(row, col, mines);
        }
      }
    }

    this.state = {
      cells: cells,
      mines: mines,
    };
  }

  clickedCell(row, col) {
    console.log("clicked!");
    if (this.state.cells[row][col] !== Sweeper.DISPLAY_STATES.UNREVEALED) {
      return;
    }
    let newCells = _.cloneDeep(this.state.cells);
    this.revealCell(row, col, newCells);

    this.setState({ cells: newCells });
  }

  revealCell(row, col, cells) {
    if (this.state.mines[row][col] === Sweeper.MINED) {
      this.revealAll(cells);
    }

    this.simpleRevealCell(row, col, cells);

    if (this.state.mines[row][col] === Sweeper.MINE_STATES.EMPTY_0) {
      Sweeper.#getNeighbors(row, col, cells)
        .filter(
          ([row, col]) => cells[row][col] === Sweeper.DISPLAY_STATES.UNREVEALED
        )
        .map(([row, col]) => this.revealCell(row, col, cells));
    }
  }

  simpleRevealCell(row, col, cells) {
    const mine = this.state.mines[row][col];
    switch (mine) {
      case Sweeper.MINE_STATES.EMPTY_0:
        cells[row][col] = Sweeper.DISPLAY_STATES.REVEALED_0;
        return;
      case Sweeper.MINE_STATES.EMPTY_1:
        cells[row][col] = Sweeper.DISPLAY_STATES.REVEALED_1;
        break;
      case Sweeper.MINE_STATES.EMPTY_2:
        cells[row][col] = Sweeper.DISPLAY_STATES.REVEALED_2;
        break;
      case Sweeper.MINE_STATES.EMPTY_3:
        cells[row][col] = Sweeper.DISPLAY_STATES.REVEALED_3;
        break;
      case Sweeper.MINE_STATES.EMPTY_4:
        cells[row][col] = Sweeper.DISPLAY_STATES.REVEALED_4;
        break;
      case Sweeper.MINE_STATES.EMPTY_5:
        cells[row][col] = Sweeper.DISPLAY_STATES.REVEALED_5;
        break;
      case Sweeper.MINE_STATES.EMPTY_6:
        cells[row][col] = Sweeper.DISPLAY_STATES.REVEALED_6;
        break;
      case Sweeper.MINE_STATES.EMPTY_7:
        cells[row][col] = Sweeper.DISPLAY_STATES.REVEALED_7;
        break;
      case Sweeper.MINE_STATES.EMPTY_8:
        cells[row][col] = Sweeper.DISPLAY_STATES.REVEALED_8;
        break;
      case Sweeper.MINE_STATES.MINED:
        cells[row][col] = Sweeper.DISPLAY_STATES.REVEALED_MINE;
        break;
    }
  }

  revealAll(cells) {
    for (let row = 0; row < cells.length; row++) {
      for (let col = 0; col < cells[0].length; col++) {
        this.simpleRevealCell(row, col, cells);
      }
    }
  }

  static #DIRECTION_VECTORS = {
    TOP_LEFT: ([row, col]) => [row - 1, col - 1],
    UP: ([row, col]) => [row - 1, col],
    TOP_RIGHT: ([row, col]) => [row - 1, col + 1],
    LEFT: ([row, col]) => [row, col - 1],
    RIGHT: ([row, col]) => [row, col + 1],
    BOTTOM_LEFT: ([row, col]) => [row + 1, col - 1],
    DOWN: ([row, col]) => [row + 1, col],
    BOTTOM_RIGHT: ([row, col]) => [row + 1, col + 1],
  };

  static #getNeighbors(row, col, board) {
    return _.values(Sweeper.#DIRECTION_VECTORS)
      .map((transform) => transform([row, col]))
      .filter(
        ([row, col]) =>
          row >= 0 && row < board.length && col >= 0 && col < board[0].length
      );
  }

  static #countAdjacentMines(row, col, mines) {
    return Sweeper.#getNeighbors(row, col, mines).filter(
      ([row, col]) => mines[row][col] === Sweeper.MINE_STATES.MINED
    ).length;
  }

  render() {
    return (
      <div>
        <button onClick={() => this.clickedCell(0, 0)}>Click</button>
        <SweeperBoard
          cells={this.props.cells}
          clickedCell={(row, col) => this.clickedCell(row, col)}
        />
      </div>
    );
  }
}
