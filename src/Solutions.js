import React from "react";
import ReactDOM from "react-dom";

// Display solutions to the current board
  // would be nice for showin empty board error?
  // Also maybe a loading message after pressing solve?
export default function Solutions(props) {

  let answers=props.words.map((item,index)=>{
    return <span key={index}
                 id={index}
                 onMouseEnter={props.showSolution}
                 onMouseLeave={props.hideSolution}>
                 {item}
           </span>
  })

  return <div id="solutions">
            {answers}
         </div>
}