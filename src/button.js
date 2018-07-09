/**
 *
 * @param {string} buttonInnertext
 */
const createButton = buttonInnertext => {
  const button = document.createElement("button");
  button.innerText = buttonInnertext;

  return button;
};

export default createButton;
