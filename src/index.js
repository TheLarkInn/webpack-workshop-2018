import foo from "./foo";
import {a} from "./bar";
import imgSrc from "./icon-square-small.jpg";
import "./index.css";

console.log(imgSrc)

const button = document.createElement("button");
button.innerText = "BUTTON";
debugger
const fancyImage = document.createElement("img");
fancyImage.src = imgSrc;

document.body.appendChild(button);
document.body.appendChild(fancyImage);