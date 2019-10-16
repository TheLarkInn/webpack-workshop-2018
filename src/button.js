function foo() {
    return 'bar';
}
function bar() {
    return 'foo';
}

const makeButton = (buttonName, buttonStyle) => {
    const button = document.createElement('button')
    button.innerText = buttonName
    button.style.color = buttonStyle
    button.addEventListener('click', onClickButton)
    function onClickButton() {
        alert('Click')
    }

    return button
}

module.exports = {foo, bar, makeButton}