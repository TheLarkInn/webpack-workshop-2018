import "./index.css";
import createButton from "./button";
// import colorElement from "./colorElement";
import imgUrl from "./icon.jpeg";
const setButtonColor = colorName => import(`./button-colors/${colorName}`);
const getColorElement = () => import("./colorElement");

console.log(imgUrl);

const img = document.createElement("img");
img.src = imgUrl;

const div = document.createElement("div");
div.innerText = "Hello World";
div.style.color = "red";

const buttonColorInput = document.createElement("input");

const button = createButton("HEY FIRST BUTTON YO!");
const button1 = createButton("CHANGE THIS THEME");

button.addEventListener("click", e => {
  getColorElement().then(m => {
    let colorElement = m.default;
    colorElement(div, "cyan");
  });
});

button1.addEventListener("click", e => {
  const colorVal = buttonColorInput.value;
  setButtonColor(colorVal).then(({ color }) => {
    debugger;
    button1.style.color = color;
  });
});

document.body.appendChild(button);
document.body.appendChild(div);
document.body.appendChild(img);
document.body.appendChild(buttonColorInput);
document.body.appendChild(button1);
