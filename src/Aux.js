import React from "react";
import ReactDOM from "react-dom";

// return an array [x,y] for position
// given a string in the form x#y#
function GetPos(id) { 
  var coords = ["",""]
  var dimension = 1;

  for (let i=1; i<id.length; i++) {
    if (id[i]==="y") {
      dimension = 0
    } else {
      coords[dimension] = coords[dimension]+""+id[i]
    }
  }
  coords[0] = Number(coords[0])
  coords[1] = Number(coords[1])
  return coords
};

// return a random lowercase english letter
function RandomLetter() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz"
  return alphabet[Math.floor(Math.random() * alphabet.length)]
}

// return false if a value in the 2 dimensional array = ""
// assumes the lengths of the inner and outer arrays are equal
function AllFilled(letters){
    var allFilled = true
    for (let i=0; i<letters.length; i++) {
      for (let j=0; j<letters.length; j++) {
        if (letters[i][j]==="")
          allFilled = false
    } }

    return allFilled
}

// returns the position in the alphabet of a letter
function LetterID(character) {
  return character.toLowerCase().charCodeAt(0)-97
}

// counts repeated array elements and returns an object
// example: ["s", "a", "s", "s"] would return { s: 3 }
function CountCopies(letters) {
  letters = letters.sort()
  letters[letters.length]="X"
  var last = "", count=1, out={}

  for (let i=0; i<letters.length; i++) {
    var letter = letters[i]

    if (last === letter) {
      count++
    } else {
      if (count > 1)
        out[last] = count
      count = 1;
    }

    last = letter
  }

  return out
}
// make an array of positions of letter in word
// then calculate the distances between their combinations
// return the result as an array integer distances
function LetterDistances(word, letter) {
  var positions = [],
      distances = []

  // make array of positions
  for (let i=0; i<word.length; i++) {
    if (word[i] === letter)
      positions.push(i)
  }
  // compare positions to each other
  // using a 2 dimensional array to track visited combinations
  var visited = []
  for (let i=0; i<positions.length; i++) {
    if (visited[i] === undefined)
      visited[i] = []
    for (let j=0; j<positions.length; j++) {
      if (visited[i][j] === undefined) {
        visited[i][j] = false
        if (visited[j] == undefined)
          visited[j] = []
        visited[j][i] = false
      }
      // add the unique distance
      if (i!==j && !visited[i][j]){
        distances.push(Math.abs(positions[i]-positions[j]))
        // mark as visited
        visited[i][j] = true; visited[j][i] = true
      }
    }
  }

  return distances
}

// get the distance between each instance of letter on the board
function BoardDistances(table, letter) {
  // grab all positions of letter
  var hash = LetterID(letter),
      coords = [...table.state.positions[hash]]

  return coords
}

// calculate chebyshev distance for two coordinates
function BoardDistance(x1, y1, x2, y2) {
  let xDiff = Math.abs(x2-x1),
	    yDiff = Math.abs(y2-y1)

  return Math.max(xDiff, yDiff)
}

// check if a letter is whitelisted
function isWhitelisted(letter) {
  return /^[a-zA-Z]+$/.test(letter)
}

export { 
         GetPos, 
         RandomLetter, 
         LetterID, 
         AllFilled, 
         CountCopies,
         LetterDistances,
         BoardDistances,
         BoardDistance,
         isWhitelisted
       }