/**
 * @param {string} divText 
 * @param {string} textColor 
 * @returns {HTMLDivElement}
 */
const makeDiv = (divText, textColor) => {
    const divEl = document.createElement("div");
    divEl.innerText = divText;
    divEl.style.color = textColor;

    return divEl;
}

export default makeDiv;