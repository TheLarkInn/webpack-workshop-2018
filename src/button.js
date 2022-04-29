// take a str, the button label and return a element
/**
 *
 * @param {string} buttonName
 * @returns {Element}
 */
const makeButton = (label) => {
  const button = document.createElement('button');
  button.innerText = label;
  return button;
};

module.exports = makeButton;
