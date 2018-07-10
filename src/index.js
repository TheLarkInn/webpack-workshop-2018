import "./index.css";
import createButton from "./button";
// import colorElement from "./colorElement";
import imgUrl from "./icon.jpeg";

let setButtonColor;
if (process.env.NODE_ENV === "development") {
  setButtonColor = colorName => import(/* webpackMode: 'lazy-once' */ `./button-colors/${colorName}`);
} else {
  setButtonColor = colorName => import(`./button-colors/${colorName}`);
}

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
  import("./divColor.css");
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
