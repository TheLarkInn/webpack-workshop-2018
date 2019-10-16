import nav from './nav';
import { top, bottom, footer } from './footer';
import { makeButton } from './button';
import { red, blue } from './button-style';
import buttonStyles from './button.css'
import logoUrl from './webpack-logo.jpg'
import makeImage from './makeLogo'

document.body.appendChild(makeButton('Hey! This is a button', red))
document.body.appendChild(makeImage(logoUrl))
document.body.appendChild(footer)

