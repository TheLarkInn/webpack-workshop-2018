import nav from './nav';
import footer from './footer';
import makeButton from './button';
import { makeColorStyle } from './button-styles';

const newButton = makeButton('Click me!!');
newButton.style = makeColorStyle('teal');
document.body.appendChild(newButton);

document.body.appendChild(footer);

console.log(nav(), makeButton('My first button!'), makeColorStyle('cyan'));
