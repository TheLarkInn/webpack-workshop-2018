import "./index.css";
import "./button.css";
import "./image.css";

import imgSrc from "./webpack-image.png";
import makeDiv from "./makeDiv";
import makeButton from "./makeButton";

const getMakeUniqSpan = () => import(
    /* webpackChunkName: "makeUniqSpan" */
    "./makeUniqSpan"
);

let getMessage;

if (process.env.NODE_ENV === "production") {
    getMessage = (messageName) => import(
        `./messages/${messageName}`
    );
} else {
    getMessage = (messageName) => import(
        /* webpackMode: "lazy-once" */
        `./messages/${messageName}`
    );
}

const img = document.createElement("img");
img.src = imgSrc;

const welcomeMessage = makeDiv("Welcome!", "blue");
const button0 = makeButton("Click Me!");
const messageSearchButton = makeButton("Find Message!");
const input0 = document.createElement("input");

button0.addEventListener("click", (e) => {
    getMakeUniqSpan().then((m) => {
        const makeUniqSpan = m.default;
        const span0 = makeUniqSpan("my name is sean");
        document.body.appendChild(span0);
    })
});

messageSearchButton.addEventListener("click", () => {
    const userInput = input0.value;
    getMessage(userInput).then(({message}) => {
        const div = makeDiv(message);
        document.body.appendChild(div);
    })
});

welcomeMessage.appendChild(img);
document.body.appendChild(welcomeMessage);
document.body.appendChild(button0);
document.body.appendChild(input0);
document.body.appendChild(messageSearchButton);

