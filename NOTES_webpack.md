## Entry

Usually a string, a relative path, telling webpack where to look for the root file.

### Example config

```
//webpack.config.js
module.exports = {
  mode: 'none',
  entry: './browser.main.ts',
};

//browser.main.ts
import { Component } from ‘@angular/core’;

import { App } from ‘./app.component’;
bootstrap(App,[]);

//app.component.ts
@Component({...})
export class App {};
```
_* Note: the entry file '.ts' is a typescript file in this case, but the file would probably be '.js'. This is the ROOT file._

### What the entry property does

Tells Webpack **what** (files) to load for the browser;
Compliments the _Output_ property.

So in a Vue project, it would probably be App.js. 

Webpack goes from the entry point, down through all the called compoents and tries to create a dependency graph of all the components and linked assets.

---

## Output

Now webpack has the graph created in memory, it needs to create the bundle (compiled files).

### Example config

```
//webpack.config.js
module.exports = {
  mode: 'none',
  entry: './browser.main.ts',
  output: {
    path: './dist',
    filename: './main.js',
  },
};

//Generates main.js (bundle)
```

### What the output property does

Tells webpack **where** and **how** to distribute bundles (compilations).
Compliments the _Entry_ property.

---

## Loaders & Rules

Loaders tell webpack how to treat files that aren't javascript, or that match the conditions (rules) laid out in these loaders.

Tells webpack how to modify scss files, for example, before adding the output (modified version) into the dependency graph.

So, **loaders are simply javascript modules (functions) that take some source files and return them in a modified state**.

### Example config

```
module: {
  rules: [
    { test: /\.ts$/, use: ‘ts-loader’ },
    { test: /\.js$/, use: ‘babel-loader’ },
    { test: /\.css$/, use: ‘css-loader’ }
  ],
},
```
_Note: Each rule is a set of instructions for a loader_

### Additional loader options

There are different features to help you filter when to apply the transform loaders (only on certain files, choose to ignore some etc). 

```
module: {
  rules: [
    { 
      test: regex,
      use: (Array|String|Function)
      include: RegExp[],
      exclude: RegExp[],
      issuer: (RegExp|String)[],
      enforce: “pre”|”post”
    },
  ],
}
```
#### include / exclude
A regular expression that instructs the compiler to, for example, ignore any files that are coming from the known modules folder, or exclude test/spec files.


#### test
A regular expression that instructs the compiler which files to run the loader against. 

#### use
An array/string/function that returns loader objects. 

#### enforce
Can be “pre” or “post”, tells webpack to run this rule before or after all other rules 

### Chaining Loaders

The anatomy of a loader is a **function that takes in a source and returns a new source**.

You can apply (use) multiple loaders in one test. 

**Loaders always execute right to left on the first pass!**

This means you can chain them, like this:
```
rules: [ 
  { 
  test: /\.scss$/, 
  use:[’style’,’css’,’sass’]
  }
]

```
^ What that's doing is `(style(css(sass())))` ^

The example code is taking a .scss file > converting it to .css > converting that to inlineBrowserStyle.js in a script tag.

NOTE: For styles, this might not be the most performant. You might want to look into approaches that give you separate bundles for styles.

**Loaders don't have to apply a transform**. They can just analyse the code and output a data file, for example.

### Loaders summary

Tell Webpack **how** to interpret and translate files. 

Transforms on a per-file basis **before adding to the dependency graph**.

---

## Plugins

**Plugins add additional functionality to Compilations(optimized bundled modules)**. 

Do with plugins anything you can't do with a loader. Loaders are only applied on a profile basis, whereas plugins can access a whole bundle. 

They are more powerful with more access to CompilerAPI. 

Does everything else you’d ever want to in webpack.

e.g. UglifyJS plugin is a better way to optimise your js. If you did that with a loader, it wouldn't have access to the whole bundle. In other words, the minifier in a loader wouldn't know what's in the scope and what's being used. 


### Anatomy of a webpack plugin

* Plugins are objects (with an `apply` property)
* Allow you to hook into the entire compilation lifecycle

Webpack has a variety of built in plugins

### Basic plugin example

The below plugin example is 'plugging in' to the compiler and listening for a `done` and a `failed` event. The events are going to pass us some data, then some behaviour runs based on the data returned.

```
function BellOnBundlerErrorPlugin () { }

BellOnBundlerErrorPlugin.prototype.apply = function(compiler) {
  if (typeof(process) !== 'undefined') {
    
    // Compiler events that are emitted and handled
    compiler.plugin('done', function(stats) { 
      if (stats.hasErrors()) { 
        process.stderr.write('\x07'); 
      }
    });
    
    compiler.plugin('failed', function(err) { 
      process.stderr.write('\x07'); 
    });
  
  }
}

module.exports = BellOnBundlerErrorPlugin
```
_Note: '\x07' is a Bell noise_

### How to use plugins

1. First _require()_ the plugin from node_modules (or from a local path) into config. 
2. Add a new instance of the plugin to plugins key in your config object.
3. Provide additional info for arguments

```
// require() from node_modules or webpack or local file
var BellOnBundlerErrorPlugin = require(‘bell-on-error’);
var webpack = require(‘webpack’);

module.exports = {
  //...
  plugins: [
    new BellOnBundlerErrorPlugin(),
    
    // Just a few of the built in plugins
    new webpack.optimize.CommonsChunkPlugin(‘vendors’),
    new webpack.optimize.UglifyJsPlugin()
  ]
  //...
}

```

### Note on plugins in Webpack's architecture

Webpack is 80% a plugin system. It is just loads of small plugins, each doing one thing, chained together. 

This makes it much more maintainable - it's easy to add or remove features with very little work.

### Plugin summary

* Use loaders for stuff you want to apply at a file-level (e.g. convert sass to css)
* Use plugins for stuff you want to apply at a bundle-level (e.g. minify javascript or purge css)