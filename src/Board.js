import React from "react";
import ReactDOM from "react-dom";

import * as A from './Aux.js';
import PositionTable from './PositionTable.js';
import Solutions from './Solutions.js';
import Solve, {WORDS, COORDS } from './Solve.js';

// Display the boggle board and buttons
export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      size: 4,
      letters: [["","","",""],
                ["","","",""],
                ["","","",""],
                ["","","",""]],
      solutionWords: [],
      solutionCoords: [],
      highlight: []
    };

    this.handleInput = this.handleInput.bind(this)
    this.grow = this.grow.bind(this)
    this.shrink = this.shrink.bind(this)
    this.randomFill = this.randomFill.bind(this)
    this.clear = this.clear.bind(this)
    this.solve = this.solve.bind(this)
    this.reset = this.reset.bind(this)
    this.showSolution = this.showSolution.bind(this)
    this.hideSolution = this.hideSolution.bind(this)
  }

  handleInput(event) {
    // get position and value of modified cell
    let pos = A.GetPos(event.target.id)
    let val = event.target.value

    // update the old oldState
    let newState = this.state.letters
    if (A.isWhitelisted(val) || val==="")
      newState[pos[0]][pos[1]] = val.toLowerCase()

    // update state
    this.setState({letters: newState});
    this.reset()
  }

  // clear solutions when the board is modified
  reset() {
    this.setState({solutionWords: [], solutionCoords: []})
  }

  grow(event) {
    event.preventDefault()

    // make sure the board isn't too big
    if (this.state.size < 15) {
      var newState = this.state.letters
      var newSize = this.state.size+1

      // add a new row
      newState.push([])
      newState[this.state.size].push("")

      // add a cell to each row
      for (let i=0; i<this.state.size; i++) {
        newState[i].push("")
        newState[this.state.size].push("")
      }

      // update state
      this.setState({size: newSize, letters: newState})
      this.reset()
    }
  }

  shrink(event) {
    event.preventDefault()

    // make sure the board isn't too smal
    if (this.state.size>2) {
    var newState = this.state.letters
    var newSize = this.state.size-1

    // remove a row
    newState.pop()

    // remove a cell from each row
    for (let i=0; i<newSize; i++) {
      newState[i].pop()
    }

    // updade sate
    this.setState({size: newSize, letters: newState})
    this.reset()
    }
  }

  randomFill(event) {
    event.preventDefault()
    var newState = this.state.letters

    // loop through each cell
    for (let i=0; i<newState.length; i++) {
      for (let j=0; j<newState.length; j++) {
        // only replace empty cells
        if (newState[i][j] === "") {
          // insert a random  letter using Aux function
          newState[i][j] = A.RandomLetter()
        }
      }
    }
    // update state
    this.setState({letters: newState})
    this.reset()
  }

  clear(event) {
    event.preventDefault()
    var newState = this.state.letters

    // loop through each cell
    for (let i=0; i<newState.length; i++) {
      for (let j=0; j<newState.length; j++) {
        // set the value to empty string
        newState[i][j] = ""
      }
    }
    // update state
    this.setState({letters: newState})
    this.reset()
  }

  solve(event) {
    event.preventDefault()
    const letters = this.state.letters

    // Make sure all squares are filled
    if (A.AllFilled(letters)) {
      // create a table of letter positions
      let posTable = new PositionTable(this.state)
      // prune the dictionary using letter positions
      let words = posTable.prune()
      // give the updated word list to the solver
      let answer = Solve(words, posTable)
      // update state to display solutions/coordinates
      this.setState({
                     solutionWords: answer[0],
                     solutionCoords: answer[1]
                   })
    }
    // reset the solution holders
    WORDS=[]
    COORDS=[]
  }

  showSolution(event) {
    let coords = this.state.solutionCoords[event.target.id]
    this.setState({highlight: coords})
  }

  hideSolution(event) {
    this.setState({highlight: []})
  }

  render() {
    // Map outer array to table rows (BoardRow)
    let letterMap=this.state.letters.map((item,index)=>{
      return <BoardRow key={index} 
                       letters={item} 
                       handleInput={this.handleInput}
                       y={index}
                       highlight={this.state.highlight}/>
    })

    // Display buttons and game board
    return <div id="container">
             <form>

              <button style={{width: "28px"}} 
                      onClick={this.shrink}>-
              </button>

              <button style={{width: "28px"}}
                      onClick={this.grow}>+
              </button>

              <button onClick={this.randomFill}>Random fill</button>
              <button onClick={this.clear}>Clear</button>
              
              <table>
                <tbody>
                  {letterMap}
                </tbody>
              </table>

              <button onClick={this.solve}>Solve</button>

              <Solutions words={this.state.solutionWords}
                         coords={this.state.solutionCoords}
                         showSolution={this.showSolution}
                         hideSolution={this.hideSolution}/>

            </form>
          </div>
  }
}


// Map inner array to table data (Board Cell)
function BoardRow(props) {
  return <tr>
    {props.letters.map((item,index)=>{
         return <BoardCell key={index}
                           letter={item}
                           handleInput={props.handleInput}
                           y={props.y}
                           x={index}
                           highlight={props.highlight}/>
      })}
  </tr>
}

// Display a board cell
function BoardCell(props) {

  var highClass = "flat";
  // determine if cell should be highlighted
  if (props.highlight.length > 0) {
    for (let i=0; i<props.highlight.length; i++) {
      let cX = props.highlight[i][1],
          cY = props.highlight[i][0]
      if (cX === props.x && cY === props.y) {
        highClass="glow"
      }
    }
  }

  return <td>
           <input className={highClass}
                  type="text" 
                  maxLength="1" 
                  onChange={props.handleInput}
                  id={"x"+props.x+"y"+props.y}
                  value={props.letter}/>
         </td>
}

