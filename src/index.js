import makeDiv from "./makeDiv";
import makeButton from "./makeButton";

const welcomeMessage = makeDiv("Welcome!", "blue");
const button0 = makeButton("Click Me!");

document.body.appendChild(welcomeMessage);
document.body.appendChild(button0);
