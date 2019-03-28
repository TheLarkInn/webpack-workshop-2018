import "./index.css";
import "./button.css";
import "./image.css";

import imgSrc from "./webpack-image.png";
import makeDiv from "./makeDiv";
import makeButton from "./makeButton";

const img = document.createElement("img");
img.src = imgSrc;

const welcomeMessage = makeDiv("Welcome!", "blue");
const button0 = makeButton("Click Me!");

welcomeMessage.appendChild(img);

document.body.appendChild(welcomeMessage);
document.body.appendChild(button0);
