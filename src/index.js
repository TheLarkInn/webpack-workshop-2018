import "./index.css";
import createButton from "./button";
// import colorElement from "./colorElement";
import imgUrl from "./icon.jpeg";
const getColorElement = () => import("./colorElement");

console.log(imgUrl);

const img = document.createElement("img");
img.src = imgUrl;

const div = document.createElement("div");
div.innerText = "Hello World";
div.style.color = "red";

const button = createButton("HEY FIRST BUTTON YO!");

button.addEventListener("click", e => {
  getColorElement().then(m => {
    let colorElement = m.default;
    colorElement(div, "cyan");
  });
});

document.body.appendChild(button);
document.body.appendChild(div);
document.body.appendChild(img);
