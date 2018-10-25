import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Label(props) {
  return (
    <div className="board-label">{props.value}</div>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board label-left">
          <Label value="3" />
          <Label value="2" />
          <Label value="1" />
        </div>

        <div className="board">
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>

        <div className="board label-bottom">
          <Label value="A" />
          <Label value="B" />
          <Label value="C" />
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
        column: calculateColumn(i),
        row: calculateRow(i)
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      const colRow = (step.column && step.row) ? '(' + step.column + step.row + ')' : '';

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc} {colRow}</button>
        </li>
      );
    });

    let status;
    status = (winner) ? 'Winner: ' + winner : 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>
            <span>{this.state.column}{this.state.row}</span>
            {moves}
          </ol>
        </div>
      </div>
    );
  }
}

function calculateColumn(i) {
  const columns = [
    { name: 'A', squares: [ 0, 3, 6 ] },
    { name: 'B', squares: [ 1, 4, 7 ] },
    { name: 'C', squares: [ 2, 5, 8 ] }
  ];

  return getColumnRow(i, columns);
}

function calculateRow(i) {
  const rows = [
    { name: 1, squares: [6, 7, 8] },
    { name: 2, squares: [3, 4, 5] },
    { name: 3, squares: [0, 1, 2] }
  ];

  return getColumnRow(i, rows);
}

function getColumnRow(i, array) {
  for (let j=0; j<array.length; j++) {
    if (array[j].squares.includes(i)) {
      return array[j].name;
    }
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i=0; i<lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
