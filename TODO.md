# Section 0 - from _scratch_

## Lesson 00 (feature/00-fem-from-scratch)

### Install all dependencies in the package

If you are using npm then you can use the following syntax:

```bash
npm install
```

or with yarn:

```bash
yarn install
```

## Lesson 01 (feature/01-fem-first-script)

### Adding first script

Jump to `package.json` and add a `"scripts"` key:

**package.json**

```json
{
  "scripts": {
    "webpack": "webpack"
  }
  /* ... */
}
```

This now enables you to run `yarn webpack` or `npm run webpack` right from your terminal.

## Lesson 02 (feature/02-composing-scripts)

### Composing npm scripts

Scripts can also be composed together! This means we can share common commands and add flags onto them using:

```bash
npm run <npm-script-name> -- --some-flag
```

A great usecase for this is to set the `mode` property in webpack!

**package.json**

```json
{
  "scripts": {
    "webpack": "webpack",
    "prod": "npm run webpack -- --mode production",
    "dev": "npm run webpack -- --mode development"
  }
  /* ... */
}
```
