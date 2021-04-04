import React from "react";
import ReactDOM from "react-dom";

import * as A from './Aux.js';
import Prune from './Prune.js';

// recieves a copy of Board state
// organizes the data for dictionary pruning
export default class PositionTable extends React.Component {
  
  // loop through letters in table for positions (x,y)
  // and put them in a new array organized by letters
  // so every letter lists the coordinates it appears as
  constructor(props) {
    super(props);

    // create empty arrays for state.positions and state.touching
    var emptyTouching=[], coordMap=[]
    for (let i=0; i<26; i++) {
      coordMap[i] = []
      emptyTouching[i] = []
    }

    // create empty arrays for state.isTouching
    var emptyIsTouching = []
    for (let i=0; i<26; i++) {
      emptyIsTouching[i] = []
      for (let j=0; j<26; j++) {
        emptyIsTouching[i][j] = undefined;
    } }

    // user letters from Board to populate state.positions
    for (let x=0; x<props.letters.length; x++){
      for (let y=0; y<props.letters[0].length; y++) {
        let newPos = [x,y]
        let hash = A.LetterID(props.letters[x][y])
        coordMap[hash].push(newPos)
    } }

    this.state = {             
      size: props.size,           // width and height of board
      letters: props.letters,     // letters from the board
      positions: coordMap,        // letter coordinates
      touching: emptyTouching,    // filled by touchingLetter()
      isTouching: emptyIsTouching // filled by isTouching()
    };

    this.touchingLetter = this.touchingLetter.bind(this)
    this.touchingPos = this.touchingPos.bind(this)
    this.isTouching = this.isTouching.bind(this)
    this.prune = this.prune.bind(this)
    this.copies = this.copies.bind(this)
  }

  // call the prune method to pass the table to Prune
  prune() { return Prune(this) }

  // return true if a is next to b on the board
  isTouching(a, b) {
    var result, aPos = A.LetterID(a), bPos = A.LetterID(b)

    if (this.state.isTouching[aPos][bPos] === undefined) {
      // find if the letters touch, store result in result
      result = this.touchingLetter(a).includes(b);
      // store in state for faster lookup
      let newState = this.state.isTouching
      newState[aPos][bPos] = result
      newState[bPos][aPos] = result
      this.setState({isTouching: newState})
     }
    
    return this.state.isTouching[aPos][bPos]
  }

  // return all letters touching a coordinate
  touchingPos(pos) {
    var x=pos[0], y=pos[1], letters=[], diff=[-1,0,1],
    table=[...this.state.letters], max=this.state.size,
    newX, newY
    
    // loop through potential adjecent cells
    for (let i=0; i<3; i++) {
      for (let j=0; j<3; j++) {
        newX=x+diff[i],newY=y+diff[j]
        // make sure the cell exists
        if (newX>=0 && newX<max) {
          if (newY>=0 && newY<max) {
            // make sure its not the original cell
            if (!(newY===y && newX===x)) {
              // add the cell's letter for output
              letters.push(table[newX][newY])
            }
          }
        }
      }
    }
    return letters
  }
  
  // return the number of copies of a letter 
  copies(letter) {
    var hash = A.LetterID(letter),
    return this.state.positions[hash].length
  }

  // return all letters touching a letter
  touchingLetter(letter) {
    var hash = A.LetterID(letter),
    coords = this.state.positions[hash],
    letters = [], copy = []

    //copy the coords array from state
    for (let i=0; i<coords.length; i++){
      copy[i] = [...coords[i]]
    }

    // Check if letter is cached
    if (this.state.touching[hash].length === 0) {
      for (let i=0; i<copy.length; i++) {
        letters = letters.concat(this.touchingPos(copy[i]))
      }

      // get all unique letters discovered
      letters = [...new Set(letters)];

      // store in state for faster lookup
      let newState = this.state.touching
      newState[hash] = letters
      this.setState({touching: newState})

    } else {
      // retrieve letters from state (touching)
      letters = [...this.state.touching[hash]]
    }
  
    return letters
  }
}