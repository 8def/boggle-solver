import React from "react";
import ReactDOM from "react-dom";

import * as A from './Aux.js';
import { TRIE } from './Dictionary.js'

/*
 recursive function to prune copy of dictionary TRIE
 start with a copy of TRIE (using JSON hack) and modify
 it directly, using stack to determine when finished

 if parent letter (pl) isn't touching child letter (cl)
   then prune the trie at cl
 */
export default function Prune( props,
                               words = [],
                               target=JSON.parse(
                                      JSON.stringify(TRIE)),
                               parent="",
                               stack=["X"]) {
  
  // Case: unexpected target data               
  if (typeof target != 'object')
		return; 

  // store last parent to compare with child                      
  var pl = parent.charAt(parent.length-1);

	// loop trough target's children and submit for pruning
	for (const cl in target) {

    // Case: first node, prune child with current as parent
		if (parent.length < 1) {   
      stack.push(parent+cl)
			Prune(props, words, target[cl], parent+cl, stack)    

		// make sure the child is letter (not word marker)
		} else if (typeof target[cl] == 'object') {

			// if letters aren't touching on board
			if(!props.isTouching(cl, pl)) {
				delete target[cl];

			// if letters are touching on the board
			} else {
          stack.push(parent+cl)
					Prune(props, words, target[cl], parent+cl, stack)
			}
		} else {
      // add discovered word
      if (parent.length > 2)
        words.push(parent)
    }
	}                  
  stack.pop()

  // return words as an array
  if(stack.length < 1) {
    return words
  }
}