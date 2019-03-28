import "./index.css";
import "./button.css";
import "./image.css";
import imgSrc from "./webpack-image.png";
import makeDiv from "./makeDiv";
import makeButton from "./makeButton";
const getMakeUniqSpan = () => import("./makeUniqSpan");


const img = document.createElement("img");
img.src = imgSrc;

const welcomeMessage = makeDiv("Welcome!", "blue");
const button0 = makeButton("Click Me!");

button0.addEventListener("click", (e) => {
    getMakeUniqSpan().then((m) => {
        const makeUniqSpan = m.default;
        const span0 = makeUniqSpan("my name is sean");
        document.body.appendChild(span0);
    })
});

welcomeMessage.appendChild(img);
document.body.appendChild(welcomeMessage);
document.body.appendChild(button0);
