/**
 * @param {string} buttonText 
 * @returns {HTMLButtonElement}
 */
const makeButton = (buttonText) => {
    const el = document.createElement("button");
    el.innerText = buttonText;

    return el;
}

export default makeButton;