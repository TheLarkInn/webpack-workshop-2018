import nav from "./nav";
// import { footer } from "./footer";
const getFooter = () => import("./footer");
import makeButton from "./button";
import { makeColorStyle } from "./button-styles";
import makeImage from "./image";
import imageUrl from "./webpack-logo.jpg";
import css from "./footer.css";
import buttonStyles from "./button.css";

const image = makeImage(imageUrl);
const button = makeButton("Yay! A Button!");
button.style = makeColorStyle("cyan");

document.body.appendChild(button);

button.addEventListener("click", e => {
    getFooter().then(footerModule => {
        document.body.appendChild(footerModule.footer);
    });
});


document.body.appendChild(image);

