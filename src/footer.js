import './footer.css';

export var top = "top";
export var bottom = "bottom";
export function makeFooter(){
  var footer = document.createElement('footer');
  footer.innerHTML = 'I\'m a Footer';
  return footer;
}
