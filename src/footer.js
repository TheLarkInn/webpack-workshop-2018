import { red, blue } from './button-style'
import "./footer.css"
const top = document.createElement("div");
top.innerText = 'This is top a footer'
top.style.color = red

const bottom = document.createElement("div");
bottom.innerText = 'This is bottom a footer'
bottom.style.color = blue

const footer = document.createElement("footer");
footer.appendChild(top)
footer.appendChild(bottom)


export { top, bottom, footer }