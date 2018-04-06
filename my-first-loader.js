module.exports = function loader(src) {
    const callback = this.async();
    const newSource = src.replace(".log", ".error");

    callback(null, JSON.stringify(newSource));
}
