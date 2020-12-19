import nav from "./nav";
import { top, bottom } from "./footer";
import makeButton from "./button"; // common js default export
import { makeColorStyle } from "./button-style";

console.log(nav, top, bottom, makeButton("My Button"), makeColorStyle('cyan'))
