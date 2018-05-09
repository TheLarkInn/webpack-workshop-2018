function myLoader(source) {
    debugger;
    if (this.resource === "/Users/wecomm/seanlarkin/webpack-workshop-2018/src/index.js") {
        source+="; console.log('ilovebanananas');"
    }
    return source;
} 

module.exports = myLoader;