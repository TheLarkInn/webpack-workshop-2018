function foo() {
    return 'bar';
}
function bar() {
    return 'foo';
}

module.exports = (buttonName) => {
    return `Button: ${buttonName}`;
}
module.exports = {foo, bar}