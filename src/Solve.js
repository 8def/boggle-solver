import React from "react";
import ReactDOM from "react-dom";

import * as A from './Aux.js';

// store solutionsin WORDS/COORDS
export  const WORDS = []
export const COORDS = []

  /*
  Recursively traverse the board to attempt all possible constructions of the remaining words and return solutions as two arrays

  the first contains solution words
  the second contains solution coordinates to highlight

  return [ 
          [ "ex1", "ex2" ], 
          [ [[0,1],[1,1],[1,2]], [0,1],[1,1],[2,1] ],
         ];
  */
export default function Solve(words, table) {

  // try constructing each word
  // successful solutions stored in RESULTS/COORDS
  for (let i=0; i<words.length; i++) {
    construct(words[i], table)
  }

  return [ 
          WORDS, 
          COORDS
         ];
}

// recursively attempt word constructions
// storing solutions in WORDS and COORDS
function construct(
                    word,        // word being constructed
                    table,       // board configuration
                    pos=0,       // position in word
                    visited=[]   // already seen coordinates
                  ) {

  // CASE: solution already added to WORDS
  if (WORDS.includes(word)) {
    return
  }

  // CASE: end of word reached, solution found
  if (pos >= word.length) {
    WORDS.push(word)
    COORDS.push(visited)
    return
  }

  // store the current letter of word
  var letter = word[pos],
  // find all coordinates holding letter
      hash = A.LetterID(letter),
      coords = [...table.state.positions[hash]]

  // mark any coordinates already visited
  for (let i=0; i<visited.length; i++) {
    for (let j=0; j<coords.length; j++) {
      let vx = visited[i][1], vy = visited[i][0],
          cx = coords[j][1], cy = coords[j][0]
      if (vx===cx && vy===cy) {
        coords[j] = "X"
      }
    }
  }

  // mark any coordinates not next to the last letter
  for (let i=0; i<coords.length; i++) {

    if (coords[i] != "X" && visited.length>0) {
    let x1=visited[visited.length-1][1],
        y1=visited[visited.length-1][0],
        x2=coords[i][1], y2=coords[i][0]
    
    if (A.BoardDistance(x1, y1, x2, y2) > 1)
      coords[i]="X" 
    }
  }

  // remove marked coordinates
  coords = coords.filter(function (el) {
    return el != "X";
  });
    
  // CASE: no coords left, not a solution
  if (coords.length < 1)
    return

  // CASE: attempts remaining, send new coords to construct()
  for (let i=0; i<coords.length; i++) {
    var newVisited = [...visited]
    newVisited.push(coords[i])
    let newPos = pos+1
    construct(word, table, newPos, newVisited)
  }
}