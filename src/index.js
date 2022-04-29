import nav from './nav';
import { top, bottom } from './footer';
import makeButton from './button';
import { makeColorStyle } from './button-styles';

const newButton = makeButton('Click me!!');
document.body.appendChild(newButton);

console.log(
  nav(),
  top,
  bottom,
  makeButton('My first button!'),
  makeColorStyle('cyan'),
);
