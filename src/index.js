import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
    return (
      <button 
        className="square"
        onClick={props.onClick}
        style={props.style}
      >
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      const winIndices = this.props.winIndices;
      const style = (winIndices && winIndices.includes(i)) ? {backgroundColor: 'yellow'} : null;

      return (
        <Square
          key={i}
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          style={style}
        />
      );
    }
  
    render() {
      let board = [];
      let squareIndex = 0;
      for (let i = 0; i < 3; i++) {
        let squares = [];
        for (let j = 0; j < 3; j++) {
          squares.push(this.renderSquare(squareIndex++));
        }
        board.push(<div key={i} className="board-row">{squares}</div>);
      }

      return (
        <div>
          {board}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          moveSquareIndex: null,
        }],
        stepNumber: 0,
        xIsNext: true,
        movesAscending: true,
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
          moveSquareIndex: i,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    reorderMovesList() {
      this.setState({
        movesAscending: !this.state.movesAscending,
      });
    }

    boardIsFull(squares) {
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          return false;
        }
      }
      return true;
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const position = getSquarePosition(step.moveSquareIndex);
        let desc;
        let positionDesc;

        if (move) {
          desc = 'Go to move #' + move;
          positionDesc = '(col ' + position.col + ', row ' + position.row + ')';
        } else {
          desc = 'Go to game start';
          positionDesc = '';
        }
        
        const fontWeight = move === this.state.stepNumber ? {fontWeight: 'bold'} : {};

        return (
          <li key={move} style={fontWeight}>
            <button onClick={() => this.jumpTo(move)} style={fontWeight}>{desc}</button>
            <span> {positionDesc}</span>
          </li>
        )
      });
      if (!this.state.movesAscending) {
        moves.reverse();
      }

      let status;
      if (winner) {
        status = 'Winner: ' + winner.symbol;
      } else if (this.boardIsFull(current.squares)) {
        status = 'Draw!';
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              winIndices={winner ? winner.indices : null}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick={() => this.reorderMovesList()}>Reorder {this.state.movesAscending ? 'Descending' : 'Ascending'}</button>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          indices: lines[i],
          symbol: squares[a],
        };
      }
    }
    return null;
  }

  function getSquarePosition(index) {
    return {
      col: (index % 3) + 1,
      row: (Math.floor(index / 3)) + 1,
    };
  }