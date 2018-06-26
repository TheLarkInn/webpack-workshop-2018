import nav from "./nav";
import { top, bottom } from "./footer";
import makeButton from "./button";
import { makeColorStyle } from "./button-styles";

console.log(
  nav(),
  top,
  bottom,
  makeButton("My first button!"),
  makeColorStyle("cyan")
);
