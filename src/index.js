import nav from './nav';
import { top, bottom, makeFooter } from './footer';
import Button from './button';
import { red, blue, makeColorStyle } from './buttonStyles';
import makeImage from './makeImage';
import imageUrl from './webpack-logo.jpg';

var image = makeImage(imageUrl);

console.log(image)
console.log(nav, top, bottom);
console.log(Button('My Little Button'), makeColorStyle('mustard'));

document.body.append(makeFooter());
document.body.append(image);