import nav from "./nav";
import { footer } from "./footer";
import makeButton from "./button";
import { makeColorStyle } from "./button-styles";

import css from "./footer.css";
import buttonStyles from "./button.css";

const button = makeButton("Yay! A Button!");
button.style = makeColorStyle("cyan");
document.body.appendChild(button);
document.body.appendChild(footer);
