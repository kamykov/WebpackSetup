# Webpack Setup

## 1. npm & git initialization

### commands:

```
npm init
git init
touch .gitignore
mkdir src && cd src
touch index.js index.html
```

## 2. webpack installation

### commands:

```
npm install webpack webpack-cli webpack-dev-server
```

[webpack](https://webpack.js.org/) [webpack-cli](https://github.com/webpack/webpack-cli) [webpack-dev-server](https://github.com/webpack/webpack-dev-server)

### add scripts to package.json:

```
  "scripts": {
    "webpack": "webpack",
    "start": "webpack-dev-server --open"
  },
```

### now we can use webpack with commands:

```
npm start
npm run webpack
```
